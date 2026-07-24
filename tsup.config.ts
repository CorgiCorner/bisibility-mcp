import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

export default defineConfig({
  clean: true,
  define: {
    __SERVER_VERSION__: JSON.stringify(pkg.version),
  },
  dts: true,
  entry: ["src/index.ts", "src/stdio.ts"],
  format: ["esm"],
  minify: false,
  outDir: "dist",
  shims: false,
  sourcemap: true,
  target: "node18",
});
