import { z } from "zod";

// What a client is allowed to SEND when creating a link.
export const LinkInput = z.object({
  url: z.url(),
});

// What the API SENDS BACK.
export const Link = z.object({
  id: z.string(),
  url: z.url(),
  shortCode: z.string(),
  createdAt: z.string(),
});

export const LinkList = z.array(Link);

export const IdParam = z.object({
  id: z.coerce.number().int().positive(),
});
