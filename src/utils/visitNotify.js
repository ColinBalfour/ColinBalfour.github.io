// Fire-and-forget "someone visited" ping via ntfy.sh — no backend, no account.
// To RECEIVE the pushes: install the ntfy app (iOS/Android) or open
//   https://ntfy.sh/colin-visits-6b869dd03e
// and subscribe to that topic. That's the only setup.
//
// Only coarse, non-identifying data is sent (page, referrer, rough city,
// browser/OS) — never a name, email, or the raw IP.

const NTFY_TOPIC = "colin-visits-6b869dd03e";

// True for local dev and for the owner's own devices — used to skip both the
// ntfy ping and Clarity session recording. Load any page once with ?owner=1 on
// each of your devices to permanently flag it.
export function isExcludedVisitor() {
	try {
		if (
			["localhost", "127.0.0.1", "0.0.0.0"].includes(
				window.location.hostname
			)
		)
			return true;
		const params = new URLSearchParams(window.location.search);
		if (params.get("owner") === "1") localStorage.setItem("cb_owner", "1");
		return localStorage.getItem("cb_owner") === "1";
	} catch (_) {
		return false;
	}
}

function deviceLabel() {
	const ua = navigator.userAgent || "";
	const os = /Android/i.test(ua)
		? "Android"
		: /iPhone|iPad|iPod/i.test(ua)
		? "iOS"
		: /Windows/i.test(ua)
		? "Windows"
		: /Mac OS X/i.test(ua)
		? "macOS"
		: /Linux/i.test(ua)
		? "Linux"
		: "Unknown OS";
	const browser = /Edg\//i.test(ua)
		? "Edge"
		: /OPR\//i.test(ua)
		? "Opera"
		: /Chrome\//i.test(ua)
		? "Chrome"
		: /Firefox\//i.test(ua)
		? "Firefox"
		: /Safari\//i.test(ua)
		? "Safari"
		: "Unknown browser";
	return `${browser} · ${os}`;
}

export default async function notifyVisit() {
	try {
		// Skip local dev and the owner's own devices (see isExcludedVisitor).
		if (isExcludedVisitor()) return;

		// One ping per browser session (not per SPA route change).
		if (sessionStorage.getItem("cb_notified")) return;
		sessionStorage.setItem("cb_notified", "1");

		// Rough location from IP — city/country only; the IP itself is discarded.
		let geo = "unknown location";
		try {
			const res = await fetch("https://ipwho.is/", { cache: "no-store" });
			const j = await res.json();
			if (j && j.success !== false && j.city)
				geo = `${j.city}, ${j.country_code || j.country || ""}`.trim();
		} catch (_) {
			/* geo is best-effort */
		}

		let referrer = "(direct)";
		try {
			if (document.referrer) referrer = new URL(document.referrer).hostname;
		} catch (_) {
			/* ignore malformed referrer */
		}

		const body =
			`👀 New visit\n` +
			`📄 ${window.location.pathname || "/"}\n` +
			`🔗 from ${referrer}\n` +
			`📍 ${geo}\n` +
			`💻 ${deviceLabel()}`;

		// Plain-text body => CORS-simple request (no preflight); fire and forget.
		fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
			method: "POST",
			body,
			keepalive: true,
		}).catch(() => {});
	} catch (_) {
		/* analytics must never break the page */
	}
}
