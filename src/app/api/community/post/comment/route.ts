import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, text, replyToId } = CreateCommentValidator.parse(body);
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        postId,
        text,
        replyToId,
        authorId: session.user.id,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not create comment ${error}`, {
        status: 500,
      });
    }
  }
}
