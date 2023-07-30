import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { removeUseravatarValidator } from "@/lib/validators/useravatar";
import { utapi } from "uploadthing/server";

import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { userId } = removeUseravatarValidator.parse(body);
    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: {
        imageKey: true,
      },
    });

    await utapi.deleteFiles(user?.imageKey as string);
    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: "",
      },
    });

    return new Response("OK");
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not update username at this time. Please try later",
      { status: 500 }
    );
  }
}
