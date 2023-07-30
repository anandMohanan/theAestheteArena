import { z } from "zod";

export const UseravatarValidator = z.object({
  fileUrl: z.string(),
  fileKey: z.string(),
});

export type UseravatarRequest = z.infer<typeof UseravatarValidator>;

export const removeUseravatarValidator = z.object({
  userId: z.string(),
});

export type RemoveUseravatarRequest = z.infer<typeof removeUseravatarValidator>;
