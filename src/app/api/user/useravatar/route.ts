import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UseravatarValidator } from "@/lib/validators/useravatar";

import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { fileUrl, fileKey } = UseravatarValidator.parse(body);
    console.log("File url", fileUrl);

    // update username
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: fileUrl,
        imageKey: fileKey,
      },
    });

    return new Response("OK");
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    console.log(error, "errrooroororo");

    return new Response(
      "Could not update username at this time. Please try later",
      { status: 500 }
    );
  }
}
