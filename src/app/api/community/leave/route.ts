import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubscribeToCommunityValidator } from "@/lib/validators/communities";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { communityId } = SubscribeToCommunityValidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session?.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("You are not subscribed to this subreddit.", {
        status: 400,
      });
    }
    const communityOwner = await db.community.findFirst({
      where: {
        id: communityId,
        cretorId: session?.user.id,
      },
    });

    if (communityOwner) {
      return new Response("You cannot leave from your own community.", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_communityId: {
          communityId,
          userId: session?.user.id,
        },
      },
    });

    return new Response(communityId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not leave from the community ${error}`, {
        status: 500,
      });
    }
  }
}
