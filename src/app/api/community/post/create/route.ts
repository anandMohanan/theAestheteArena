import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubscribeToCommunityValidator } from "@/lib/validators/communities";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { communityId, title, content, imageUrls } =
      PostValidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session?.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("You should subscribe to create a post.", {
        status: 400,
      });
    }
    console.log("content-----------------", content);
    let url = JSON.stringify(imageUrls);
    await db.post.create({
      data: {
        communityId,
        title,
        authorId: session?.user.id,
        content,
        imageUrls: url,
      },
    });
    console.log(url);

    return new Response(communityId);
  } catch (error) {
    console.log("eeee", error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not create post ${error}`, {
        status: 500,
      });
    }
  }
}
