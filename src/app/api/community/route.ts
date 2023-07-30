import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCommunityValidator } from "@/lib/validators/communities";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log(body);

    const { name } = CreateCommunityValidator.parse(body);
    console.log(name);

    const communityExists = await db.community.findFirst({
      where: {
        name,
      },
    });

    console.log(communityExists);

    if (communityExists) {
      return new Response("Community already exists", { status: 409 });
    }

    const community = await db.community.create({
      data: {
        name,
        cretorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    return new Response(community.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response(`Could not create community ${error}`, {
        status: 500,
      });
    }
  }
}
