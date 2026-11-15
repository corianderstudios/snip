// web/vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:3000" }, // browser talks to one origin
  },
});

// web/src/api.ts
import { z } from "zod";
import { Link, type LinkInput } from "@snip/shared";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: {
      code?: string;
      message?: string;
      fields?: Record<string, string>;
    } = {},
  ) {
    super(detail.message ?? "Request failed");
  }
}

async function request(path: string, init?: RequestInit) {
  const res = await fetch("/api" + path, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  listLinks: async () => z.array(Link).parse(await request("/links")),
  createLink: async (input: LinkInput) =>
    Link.parse(
      await request("/links", { method: "POST", body: JSON.stringify(input) }),
    ),
  deleteLink: (id: string) => request("/links/" + id, { method: "DELETE" }),
};

// web/src/Links.tsx
const links = useQuery({ queryKey: ["links"], queryFn: api.listLinks });
const create = useMutation({
  mutationFn: api.createLink,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
});
