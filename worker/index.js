import { assets } from "./assets.js";
import { words, documents } from "./content.js";
import { validAttempt } from "./learning.js";

const privateHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (body, status = 200) => Response.json(body, { status, headers: privateHeaders });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) {
      const asset = assets[url.pathname === "/" ? "/index.html" : url.pathname];
      if (!asset || !Object.hasOwn(assets, url.pathname === "/" ? "/index.html" : url.pathname)) {
        return new Response("Nicht gefunden", { status: 404 });
      }
      if (!["GET", "HEAD"].includes(request.method)) return new Response(null, { status: 405 });
      return new Response(request.method === "HEAD" ? null : asset.body(), {
        headers: {
          "Content-Type": asset.type,
          "Cache-Control": asset.type.startsWith("text/html") ? "no-cache" : "public, max-age=300",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; base-uri 'none'; object-src 'none'; form-action 'self'",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        }
      });
    }

    // Sites supplies verified request identity to the deployed Worker.
    const userId = request.headers.get("oai-authenticated-user-id");
    const signedIn = Boolean(userId && request.headers.get("oai-authenticated-user-email"));
    if (url.pathname === "/api/session" && request.method === "GET") {
      return json({ user: signedIn ? { id: userId } : null });
    }
    if (url.pathname !== "/api/progress") return json({ error: "not_found" }, 404);
    if (!signedIn) return json({ error: "sign_in_required" }, 401);
    if (!env.DB) return json({ error: "database_unavailable" }, 503);

    try {
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT payload FROM learning_attempts WHERE user_id = ? ORDER BY occurred_at, event_id"
        ).bind(userId).all();
        return json({ events: results.map(row => JSON.parse(row.payload)) });
      }
      if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
      if (request.headers.get("Origin") !== url.origin ||
          !request.headers.get("Content-Type")?.startsWith("application/json")) {
        return json({ error: "invalid_request" }, 403);
      }
      const input = await request.text();
      if (input.length > 24_000) return json({ error: "payload_too_large" }, 413);
      let body;
      try { body = JSON.parse(input); }
      catch { return json({ error: "invalid_json" }, 400); }
      if (!Array.isArray(body?.events) || body.events.length > 40 ||
          !body.events.every(event => validAttempt(event, words, documents))) {
        return json({ error: "invalid_attempts" }, 400);
      }
      const insert = env.DB.prepare(
        "INSERT OR IGNORE INTO learning_attempts (user_id, event_id, occurred_at, payload) VALUES (?, ?, ?, ?)"
      );
      const statements = body.events.map(({ id, at, kind, item, rating, mode }) =>
        insert.bind(userId, id, at, JSON.stringify({ id, at, kind, item, rating, mode }))
      );
      if (statements.length) await env.DB.batch(statements);
      return json({ ok: true });
    } catch (error) {
      console.error("Lernstand:", error.message);
      return json({ error: "database_unavailable" }, 503);
    }
  }
};
