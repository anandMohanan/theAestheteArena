import { z } from "zod";

export const CreateCommunityValidator = z.object({
  name: z.string().min(3).max(21),
});

export const SubscribeToCommunityValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CreateCommunityValidator>;
export type SubscribeToCommunityPayload = z.infer<
  typeof SubscribeToCommunityValidator
>;
