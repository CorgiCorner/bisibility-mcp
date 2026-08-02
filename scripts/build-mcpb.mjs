import { spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const packageManifest = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8"));
const bundleManifest = JSON.parse(await readFile(join(projectRoot, "mcpb/manifest.json"), "utf8"));

if (bundleManifest.version !== packageManifest.version) {
  throw new Error(
    `MCPB version ${bundleManifest.version} does not match package version ${packageManifest.version}.`,
  );
}

const outputDirectory = join(projectRoot, "artifacts");
const outputPath = join(outputDirectory, `bisibility-mcp-${packageManifest.version}.mcpb`);
const stagingDirectory = await mkdtemp(join(tmpdir(), "bisibility-mcpb-"));
const assetsDirectory = join(stagingDirectory, "assets");
const serverDirectory = join(stagingDirectory, "server");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const mcpbArgs = ["--yes", "--package", "@anthropic-ai/mcpb@2.1.2", "mcpb"];

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code ?? 1}.`));
    });
  });
}

try {
  await mkdir(assetsDirectory, { recursive: true });
  await mkdir(serverDirectory, { recursive: true });
  await cp(join(projectRoot, "mcpb/manifest.json"), join(stagingDirectory, "manifest.json"));
  await cp(
    join(projectRoot, "assets/bisibility-mcp.png"),
    join(assetsDirectory, "bisibility-mcp.png"),
  );
  await cp(join(projectRoot, "package.json"), join(serverDirectory, "package.json"));
  await cp(join(projectRoot, "package-lock.json"), join(serverDirectory, "package-lock.json"));
  await cp(join(projectRoot, "dist"), join(serverDirectory, "dist"), {
    recursive: true,
  });

  await run(
    npmCommand,
    ["ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"],
    serverDirectory,
  );
  await run(npxCommand, [...mcpbArgs, "validate", stagingDirectory], projectRoot);
  await mkdir(outputDirectory, { recursive: true });
  await rm(outputPath, { force: true });
  await run(npxCommand, [...mcpbArgs, "pack", stagingDirectory, outputPath], projectRoot);
  console.log(`Built ${outputPath}`);
} finally {
  await rm(stagingDirectory, { force: true, recursive: true });
}
