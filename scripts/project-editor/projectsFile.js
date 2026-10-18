// Read/write src/data/projects.js. The file is plain JSON wrapped in an
// `export default`, so both Vite and Node import it natively while the
// editor can still parse and rewrite it without a JS parser.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PROJECTS_FILE = path.join(ROOT, "src/data/projects.js");

const HEADER = `// Project cards + project pages (see the slug convention in CLAUDE.md).
// Edit with \`npm run edit\` (a local editor UI), or by hand — keep it valid JSON
// after \`export default\`, since the editor reads and rewrites this file.
// Projects with \`hidden: true\` are kept for reference but not shown anywhere.

export default `;

export function readProjects() {
	const text = fs.readFileSync(PROJECTS_FILE, "utf8");
	const start = text.search(/^export default /m);
	if (start === -1) throw new Error("projects.js has no `export default` line");
	return JSON.parse(text.slice(start + "export default ".length).trim().replace(/;$/, ""));
}

export function writeProjects(projects) {
	fs.writeFileSync(PROJECTS_FILE, HEADER + JSON.stringify(projects, null, "\t") + ";\n");
}
