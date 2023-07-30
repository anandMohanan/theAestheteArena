import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeletePostValidator } from "@/lib/validators/post";
import { Prisma } from "@prisma/client";
import { utapi } from "uploadthing/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const session = await getAuthSession();
    const { postId } = DeletePostValidator.parse(body);

    const post = await db.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        imageUrls: true,
        authorId: true,
      },
    });

    let imageKeys = JSON.parse(post?.imageUrls as string);

    if (!post) return new Response("Post not found", { status: 404 });
    if (post?.authorId !== session?.user.id)
      return new Response("Unauthorized", { status: 400 });

    if (imageKeys?.data) {
      await utapi.deleteFiles(imageKeys?.data);
    }
    await db.post.delete({
      where: {
        id: postId,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not delete post ${error}`, {
        status: 500,
      });
    }
  }
}
