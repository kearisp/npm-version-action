import {defineConfig} from "vitest/config";


export default defineConfig({
    test: {
        environment: "node",
        setupFiles: ["./vitest.setup.ts"],
        coverage: {
            provider: "v8",
            reportsDirectory: "./coverage",
            reporter: ["text", "lcov", "html"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/__tests__/**", "**/*.d.ts"]
        }
    }
});
