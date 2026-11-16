// Fetches the resume from rxresu.me at build time and writes it to
// public/portfolio_raw.json, so the browser loads it same-origin (no CORS).
// If the fetch fails, the existing file is kept so builds never break.
import { readFile, writeFile } from "node:fs/promises";

// Load .env for local runs (Node 20.12+); CI passes env vars directly.
try {
	process.loadEnvFile?.(".env");
} catch {}

const OUTPUT = new URL("../public/portfolio_raw.json", import.meta.url);
const PUBLIC_URL =
	process.env.RESUME_PUBLIC_URL ||
	process.env.PUBLIC_RESUME_PUBLIC_URL ||
	"https://rxresu.me/dcasasolam/frontendeng";
const API_KEY =
	process.env.RXRESUME_API_KEY || process.env.PUBLIC_RXRESUME_API_KEY || "";

const match = PUBLIC_URL.match(/rxresu\.me\/([^/]+)\/([^/?#]+)/);
const apiUrl = match
	? `https://rxresu.me/api/openapi/resumes/${match[1]}/${match[2]}`
	: PUBLIC_URL;

try {
	const res = await fetch(apiUrl, {
		headers: API_KEY ? { "x-api-key": API_KEY } : {},
		signal: AbortSignal.timeout(60000),
	});
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	const json = await res.json();
	if (!json?.data?.basics) throw new Error("Unexpected response shape");
	await writeFile(OUTPUT, JSON.stringify(json, null, 2) + "\n");
	console.log(`[fetch-resume] Updated portfolio_raw.json from ${apiUrl}`);
} catch (err) {
	const exists = await readFile(OUTPUT).then(() => true, () => false);
	console.warn(
		`[fetch-resume] Could not fetch ${apiUrl}: ${err.message}. ` +
			(exists ? "Keeping existing portfolio_raw.json." : "No local copy available!")
	);
	if (!exists) process.exit(1);
}
