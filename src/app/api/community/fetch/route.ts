import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const Ownedcommunities = await db.community.findMany({
      where: {
        cretorId: session.user.id,
      },
    });

    return new Response(JSON.stringify(Ownedcommunities));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    } else {
      return new Response(`Could not fetch communities ${e}`, {
        status: 500,
      });
    }
  }
}
