import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	// User/org GitHub Pages site is served from the domain root.
	base: "/",
	plugins: [react()],
	build: {
		// Keep the CRA output folder so `gh-pages -d build` (npm run deploy) is unchanged.
		outDir: "build",
	},
	server: {
		port: 3000,
		open: true,
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.js",
		css: true,
	},
});
