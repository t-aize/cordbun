import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	outDir: "dist",
	format: "esm",
	dts: true,
	clean: true,
	sourcemap: true,
	target: "es2024",
	treeshake: true,
	outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
});
