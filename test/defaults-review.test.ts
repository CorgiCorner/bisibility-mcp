import { readFileSync } from "node:fs";
import { BisibilityClient } from "@bisibility/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { expect, it, vi } from "vitest";
import { createBisibilityMcpServer } from "../src/index.js";
import { updateProjectDefaultsInputSchema } from "../src/schemas.js";
const f = JSON.parse(
  readFileSync(new URL("./fixtures/defaults-review.json", import.meta.url), "utf8"),
);
const review = {
  expected_source_hash: f.preview.expected_source_hash,
  expected_revision: f.preview.expected_revision,
  preview_token: f.preview.preview_token,
  idempotency_key: "same-reviewed-command",
  confirmed: true,
};
async function setup(readOnly = false, advertised = true) {
  const calls: { url: URL; body: unknown; headers: Headers; method: string | undefined }[] = [];
  const sdk = new BisibilityClient({
    apiKey: "bsb_key_test_fixture",
    baseUrl: "https://fixture.example.com/api/v1",
    maxRetries: 0,
    fetch: async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/capabilities"))
        return Response.json({
          apiVersions: ["v1"],
          data: [],
          ...(advertised ? { features: { reviewed_project_defaults: "v1" } } : {}),
        });
      const call = {
        url,
        body: undefined as unknown,
        headers: new Headers(init?.headers),
        method: init?.method,
      };
      calls.push(call);
      if (init?.body != null) call.body = JSON.parse(String(init.body));
      return Response.json(url.searchParams.get("preview_only") === "true" ? f.preview : f.saved);
    },
  });
  const sdkCalls = {
    preview: vi.spyOn(sdk, "previewProjectDefaults"),
    update: vi.spyOn(sdk, "updateProjectDefaults"),
  };
  const server = createBisibilityMcpServer({ client: sdk, readOnly, toolsets: ["projects"] });
  const client = new Client({ name: "reviewed-defaults-fixture", version: "1" });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(b);
  await client.connect(a);
  return {
    client,
    calls,
    sdkCalls,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}
it("exposes preview under read-only mode and excludes confirmation writes", async () => {
  vi.stubEnv("BISIBILITY_PROJECT_ID", "");
  const h = await setup(true);
  try {
    const tools = (await h.client.listTools()).tools;
    const preview = tools.find((t) => t.name === "preview_project_defaults");
    expect(preview?.annotations?.readOnlyHint).toBe(true);
    expect(preview?.inputSchema.properties).not.toHaveProperty("review");
    expect(tools.some((t) => t.name === "update_project_defaults")).toBe(false);
    const result = await h.client.callTool({
      name: "preview_project_defaults",
      arguments: { project_id: f.project, ...f.patch, idempotency_key: review.idempotency_key },
    });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toEqual(f.preview);
    expect(h.calls[0]?.body).toEqual(f.patch);
    expect(h.calls[0]?.url.searchParams.get("preview_only")).toBe("true");
    expect(h.calls[0]?.method).toBe("PATCH");
    expect(h.calls[0]?.headers.get("Idempotency-Key")).toBeNull();
  } finally {
    await h.close();
    vi.unstubAllEnvs();
  }
});
it("forwards only explicit reviewed fields and stable retry key to actual SDK", async () => {
  const h = await setup();
  try {
    const result = await h.client.callTool({
      name: "update_project_defaults",
      arguments: { project_id: f.project, ...f.patch, review },
    });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toEqual(f.saved);
    expect(h.calls[0]?.body).toEqual({ ...f.patch, review });
    expect(h.calls[0]?.headers.get("Idempotency-Key")).toBe(review.idempotency_key);
    expect(h.calls[0]?.url.search).toBe("");
    expect(h.calls[0]?.method).toBe("PATCH");
  } finally {
    await h.close();
  }
});
it("rejects numeric revision, auto-confirmation and mismatched key before any request", async () => {
  const h = await setup();
  try {
    for (const [args, path] of [
      [{ review: { ...review, expected_revision: 1 } }, ["review", "expected_revision"]],
      [{ review: { ...review, confirmed: false } }, ["review", "confirmed"]],
      [{ review, idempotency_key: "another-command" }, ["idempotency_key"]],
    ] as const) {
      const argumentsValue = { project_id: f.project, ...f.patch, ...args };
      const parsed = updateProjectDefaultsInputSchema.safeParse(argumentsValue);
      expect(parsed.success).toBe(false);
      if (parsed.success) throw new Error("Invalid defaults input accepted");
      expect(parsed.error.issues).toEqual(
        expect.arrayContaining([expect.objectContaining({ path })]),
      );
      if (path[0] === "idempotency_key")
        expect(
          parsed.error.issues.find((issue) => issue.path[0] === "idempotency_key")?.message,
        ).toBe("Command keys must agree.");
      const result = await h.client.callTool({
        name: "update_project_defaults",
        arguments: argumentsValue,
      });
      expect(result.isError).toBe(true);
    }
    const result = await h.client.callTool({
      name: "preview_project_defaults",
      arguments: { project_id: f.project, ...f.patch, review },
    });
    expect(result.isError).toBe(true);
    expect(h.calls).toHaveLength(0);
    expect(h.sdkCalls.preview).not.toHaveBeenCalled();
    expect(h.sdkCalls.update).not.toHaveBeenCalled();
  } finally {
    await h.close();
  }
});

it.each([
  ["both padded", ` ${review.idempotency_key} `, ` ${review.idempotency_key} `],
  ["request padded", ` ${review.idempotency_key} `, review.idempotency_key],
  ["review padded", review.idempotency_key, ` ${review.idempotency_key} `],
])("normalizes caller command keys consistently (%s)", async (_name, requestKey, reviewKey) => {
  const h = await setup();
  try {
    const result = await h.client.callTool({
      name: "update_project_defaults",
      arguments: {
        project_id: f.project,
        ...f.patch,
        review: { ...review, idempotency_key: reviewKey },
        idempotency_key: requestKey,
      },
    });
    expect(result.isError).not.toBe(true);
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0]?.method).toBe("PATCH");
    expect(h.calls[0]?.body).toEqual({ ...f.patch, review });
    expect(h.calls[0]?.headers.get("Idempotency-Key")).toBe(review.idempotency_key);
  } finally {
    await h.close();
  }
});

it("never forwards a preview or reviewed update PATCH to a legacy server", async () => {
  const h = await setup(false, false);
  try {
    for (const [name, extra] of [
      ["preview_project_defaults", {}],
      ["update_project_defaults", { review }],
    ] as const) {
      const result = await h.client.callTool({
        name,
        arguments: { project_id: f.project, ...f.patch, ...extra },
      });
      expect(result.isError).toBe(true);
    }
    expect(h.calls).toHaveLength(0);
  } finally {
    await h.close();
  }
});
