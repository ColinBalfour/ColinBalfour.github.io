import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Inline the built stylesheet into index.html instead of linking it.
//
// The bundle is ~38kB (~7kB gzipped), so this removes a render-blocking
// round-trip on first paint. It also makes the page robust for session-replay
// tools (Clarity): a <style> element is part of the DOM and always captured,
// whereas an external <link href="/assets/…"> has to be re-resolved against
// the replay player's own origin, and the replay renders unstyled if it isn't.
function inlineCss() {
	return {
		name: "inline-css",
		apply: "build",
		enforce: "post",
		transformIndexHtml(html, ctx) {
			if (!ctx || !ctx.bundle) return html;
			let out = html;
			for (const [fileName, asset] of Object.entries(ctx.bundle)) {
				if (asset.type !== "asset" || !fileName.endsWith(".css")) continue;
				const base = fileName.split("/").pop();
				const link = new RegExp(
					`<link[^>]*href="[^"]*${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`,
					"g"
				);
				if (!link.test(out)) continue;
				link.lastIndex = 0;
				out = out.replace(
					link,
					`<style>${asset.source.toString()}</style>`
				);
			}
			return out;
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	// User/org GitHub Pages site is served from the domain root.
	base: "/",
	plugins: [react(), inlineCss()],
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
