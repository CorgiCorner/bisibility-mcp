import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

export default defineConfig({
  define: {
    __SERVER_VERSION__: JSON.stringify(pkg.version),
  },
  test: {
    coverage: {
      all: true,
      exclude: ["dist/**", "test/**", "src/stdio.ts", "*.config.ts"],
      include: ["src/**/*.ts"],
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
    environment: "node",
    exclude: ["test/integration/**"],
    globals: false,
    include: ["test/**/*.test.ts"],
  },
});
