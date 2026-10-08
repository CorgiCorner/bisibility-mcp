"""Require current native candidate CI before publishing a stable package."""

from __future__ import annotations

import http.client
import json
import os
import re
import ssl
import subprocess
import urllib.parse
from collections.abc import Callable
from typing import Any


def verify_publication(
    tag: str, sha: str, annotation: str, api: Callable[[str], dict[str, Any]], jobs: set[str]
) -> None:
    if not re.fullmatch(r"v\d+\.\d+\.\d+", tag):
        raise ValueError("Package publication requires a stable version tag.")
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Package publication requires a full commit SHA.")
    final_ref = api("/git/ref/tags/" + urllib.parse.quote(tag, safe=""))["object"]
    if final_ref.get("type") != "tag":
        raise ValueError("Final tag must be annotated.")
    final = api("/git/tags/" + final_ref["sha"])
    if (
        final.get("object", {}).get("type") != "commit"
        or final["object"].get("sha") != sha
        or final.get("verification", {}).get("verified") is not True
    ):
        raise ValueError("Final tag signature or commit differs.")
    proof = {}
    for key in ("Candidate-Tag", "Candidate-CI-Run", "Candidate-CI-Attempt"):
        values = re.findall(r"^" + key + r": (.+)$", annotation, re.M)
        if len(values) != 1:
            raise ValueError("Final tag candidate proof is missing or ambiguous.")
        proof[key] = values[0]
    rc = proof["Candidate-Tag"]
    if not re.fullmatch(re.escape(tag) + r"-rc\.(0|[1-9]\d*)", rc):
        raise ValueError("Candidate tag differs from stable version.")
    ref = api("/git/ref/tags/" + urllib.parse.quote(rc, safe=""))["object"]
    if ref.get("type") != "tag":
        raise ValueError("Candidate tag must be annotated.")
    candidate = api("/git/tags/" + ref["sha"])
    if candidate.get("object", {}).get("type") != "commit" or candidate["object"].get("sha") != sha:
        raise ValueError("Candidate tag does not select the package commit.")
    if candidate.get("verification", {}).get("verified") is not True:
        raise ValueError("Candidate tag signature is unverified.")
    query = urllib.parse.urlencode({"event": "push", "head_sha": sha, "per_page": 100})
    runs = api("/actions/workflows/ci.yml/runs?" + query).get("workflow_runs", [])
    matching = [
        r
        for r in runs
        if r.get("head_sha") == sha and r.get("head_branch") == rc and r.get("event") == "push"
    ]
    if not matching:
        raise ValueError("Native candidate CI is missing.")
    run = max(matching, key=lambda r: (int(r["id"]), int(r.get("run_attempt", 0))))
    if (
        str(run["id"]) != proof["Candidate-CI-Run"]
        or str(run.get("run_attempt")) != proof["Candidate-CI-Attempt"]
        or run.get("path") != ".github/workflows/ci.yml"
        or run.get("status") != "completed"
        or run.get("conclusion") != "success"
    ):
        raise ValueError("Latest native candidate CI does not match the final tag proof.")
    actual = api(f"/actions/runs/{run['id']}/attempts/{run['run_attempt']}/jobs?per_page=100").get(
        "jobs", []
    )
    if len(actual) >= 100 or {j.get("name") for j in actual} != jobs:
        raise ValueError("Native candidate CI required jobs differ.")
    if any(j.get("status") != "completed" or j.get("conclusion") != "success" for j in actual):
        raise ValueError("Native candidate CI contains unsuccessful jobs.")


def main() -> None:
    repo = os.environ["GITHUB_REPOSITORY"]
    if repo not in {"CorgiCorner/bisibility-mcp"}:
        raise ValueError("Unexpected package repository.")
    tag = os.environ["GITHUB_REF_NAME"]
    sha = subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip()
    if (
        subprocess.check_output(["git", "cat-file", "-t", "refs/tags/" + tag], text=True).strip()
        != "tag"
    ):
        raise ValueError("Final tag must be annotated.")
    annotation = subprocess.check_output(["git", "cat-file", "tag", "refs/tags/" + tag], text=True)
    token = os.environ["GITHUB_TOKEN"]

    def api(path: str) -> dict[str, Any]:
        # The workflow pins Python 3.13 and explicitly verifies TLS against the fixed GitHub host.
        # This audit rule also matches obsolete pre-3.4.3 defaults, which are never used here.
        # nosemgrep: python.lang.security.audit.httpsconnection-detected.httpsconnection-detected
        connection = http.client.HTTPSConnection(
            "api.github.com", timeout=30, context=ssl.create_default_context()
        )
        try:
            connection.request(
                "GET",
                f"/repos/{repo}{path}",
                headers={
                    "Authorization": "Bearer " + token,
                    "Accept": "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                    "User-Agent": "bisibility-package-publication",
                },
            )
            response = connection.getresponse()
            if response.status != 200:
                raise RuntimeError(f"GitHub verification returned HTTP {response.status}.")
            result = json.load(response)
            if not isinstance(result, dict):
                raise ValueError("GitHub verification response must be an object.")
            return result
        finally:
            connection.close()

    jobs = {"ci"}
    verify_publication(tag, sha, annotation, api, jobs)


if __name__ == "__main__":
    main()
