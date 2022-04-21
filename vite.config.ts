import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./store/*.test.ts", "./database/*.test.ts", "./src/*.test.ts"],
    testTimeout: 15000,
  },
});
