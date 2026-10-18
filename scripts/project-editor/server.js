// Local editor for src/data/projects.js. Run with `npm run edit`.
// No dependencies: a tiny HTTP server that serves the editor page, the files
// in public/ (so photo/video previews work), and a read/write JSON API.

import http from "http";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

import { readProjects, writeProjects, PROJECTS_FILE } from "./projectsFile.js";

const PORT = Number(process.env.PORT) || 3456;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const PUBLIC_DIR = path.join(ROOT, "public");
const EDITOR_HTML = path.join(HERE, "editor.html");

const MIME = {
	".html": "text/html; charset=utf-8",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".webp": "image/webp",
	".mp4": "video/mp4",
	".webm": "video/webm",
};

const send = (res, status, body, type = "application/json") => {
	res.writeHead(status, { "Content-Type": type });
	res.end(body);
};

// Videos need Range support or the browser won't let you scrub them
const sendFile = (req, res, file) => {
	const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
	const size = fs.statSync(file).size;
	const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
	if (!range) {
		res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
		return fs.createReadStream(file).pipe(res);
	}
	const start = range[1] ? Number(range[1]) : 0;
	const end = range[2] ? Number(range[2]) : size - 1;
	res.writeHead(206, {
		"Content-Type": type,
		"Content-Length": end - start + 1,
		"Content-Range": `bytes ${start}-${end}/${size}`,
		"Accept-Ranges": "bytes",
	});
	fs.createReadStream(file, { start, end }).pipe(res);
};

const server = http.createServer((req, res) => {
	const url = decodeURIComponent(req.url.split("?")[0]);

	if (url === "/" && req.method === "GET") {
		return send(res, 200, fs.readFileSync(EDITOR_HTML), MIME[".html"]);
	}

	if (url === "/api/projects" && req.method === "GET") {
		try {
			return send(res, 200, JSON.stringify(readProjects()));
		} catch (err) {
			return send(res, 500, JSON.stringify({ error: `Couldn't read projects.js: ${err.message}` }));
		}
	}

	if (url === "/api/projects" && req.method === "PUT") {
		let body = "";
		req.on("data", (chunk) => (body += chunk));
		req.on("end", () => {
			try {
				const projects = JSON.parse(body);
				if (!Array.isArray(projects)) throw new Error("Expected an array of projects");
				writeProjects(projects);
				console.log(`Saved ${projects.length} projects (${new Date().toLocaleTimeString()})`);
				send(res, 200, JSON.stringify({ ok: true }));
			} catch (err) {
				send(res, 400, JSON.stringify({ ok: false, error: err.message }));
			}
		});
		return;
	}

	// Anything else: serve it from public/ (photos, logos, videos)
	const file = path.join(PUBLIC_DIR, path.normalize(url));
	if (req.method === "GET" && file.startsWith(PUBLIC_DIR) && fs.existsSync(file) && fs.statSync(file).isFile()) {
		return sendFile(req, res, file);
	}

	send(res, 404, "Not found", "text/plain");
});

server.listen(PORT, "127.0.0.1", () => {
	const address = `http://localhost:${PORT}`;
	console.log(`Project editor running at ${address}`);
	console.log(`Editing ${path.relative(ROOT, PROJECTS_FILE)} — press Ctrl+C to stop`);
	if (!process.env.NO_OPEN) {
		const opener = process.platform === "win32" ? 'start ""' : process.platform === "darwin" ? "open" : "xdg-open";
		exec(`${opener} ${address}`);
	}
});
