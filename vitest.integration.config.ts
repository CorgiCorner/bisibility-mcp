import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["test/integration/**/*.test.ts"],
    testTimeout: 120_000,
  },
});
