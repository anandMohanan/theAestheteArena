import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { db } from "@/lib/db";
import { PostFeed } from "./PostFeed";
import { getAuthSession } from "@/lib/auth";
import { GeneralFeed } from "./GeneralFeed";
import { getServerSession } from "next-auth";

export const CustomFeed = async () => {
  const session = await getServerSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      community: true,
    },
  });
  let posts = await db.post.findMany({
    where: {
      community: {
        name: {
          in: followedCommunities.map(({ community }) => community.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      community: true,
    },
    take: INFINITY_SCROLLING_PAGINATION_VALUE,
  });
  if (posts.length == 0) {
    return (
      // @ts-expect-error server component
      <GeneralFeed />
    );
  } else {
    return <PostFeed initialPosts={posts} />;
  }
};
