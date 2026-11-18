import { Link, LinkList } from "@repo/shared";

// Thrown for any non-2xx response, so callers can branch on status
// and show field-level messages from a 422.
export class ApiError extends Error {
  constructor(status, body = {}) {
    super(body.error ?? "Request failed");
    this.status = status;
    this.issues = body.issues ?? [];
  }
}

// Relative path: the browser calls localhost:5173 and Vite proxies to :3000.
// Never put the host here, or you're back to a CORS error.
async function request(path, options = {}) {
  const res = await fetch("/api" + path, {
    headers: { "content-type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    // The server may not have sent JSON (a crash, a proxy error),
    // so don't let parsing failure mask the real status.
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return null; // No Content — nothing to parse
  return res.json();
}

export const api = {
  listLinks: async () => LinkList.parse(await request("/links")),

  createLink: async (url) =>
    Link.parse(
      await request("/links", {
        method: "POST",
        body: JSON.stringify({ url }),
      }),
    ),

  deleteLink: (id) => request(`/links/${id}`, { method: "DELETE" }),
};
