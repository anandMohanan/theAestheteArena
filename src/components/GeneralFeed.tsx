import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { db } from "@/lib/db";
import { PostFeed } from "./PostFeed";

export const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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
      <h1 className="flex flex-col col-span-2 space-y-6">
        Nothing to show now
      </h1>
    );
  } else {
    return <PostFeed initialPosts={posts} />;
  }
};
