export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return cors(new Response(null, { status: 204 }));
    }

    // Simple routing
    if (url.pathname === "/api/hello") {
      return cors(json({ ok: true, message: "Hello from Cloudflare Worker 👋" }));
    }

    // Example: echo (shows your request info)
    if (url.pathname === "/api/echo") {
      const data = {
        method: request.method,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams),
        ip: request.headers.get("CF-Connecting-IP") || null,
        ua: request.headers.get("User-Agent") || null,
      };
      return cors(json({ ok: true, data }));
    }

    return cors(json({ ok: false, error: "Not found" }, 404));
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function cors(res) {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(res.body, { status: res.status, headers });
}
