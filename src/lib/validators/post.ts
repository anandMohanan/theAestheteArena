import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be longer than 3 characters." })
    .max(150, { message: "Title length must be lesser than 150 characters." }),
  communityId: z.string(),
  content: z.any(),
  imageUrls: z.object({
    data: z.array(z.string()),
  }),
});

export const DeletePostValidator = z.object({
  postId: z.string(),
});
export type PostCreatePayload = z.infer<typeof PostValidator>;

export type DeletePostPayload = z.infer<typeof DeletePostValidator>;
