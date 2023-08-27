import { PostFeed } from "@/components/PostFeed";
import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export const metadata = {
  title: "Taa - Community",
  description: "Community page of Taa",
};

const page = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITY_SCROLLING_PAGINATION_VALUE,
      },
    },
  });
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          community: {
            name: slug,
          },
          user: {
            id: session?.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!community) return notFound();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14 underline decoration-wavy decoration-primary-text">
        {community.name}
      </h1>
      {isSubscribed ? null : (
        // <li className="overflow-hidden rounded-md bg-white shadow">

        <div className="h-fu px-6 py-4 flex justify-between gap-6">
          Join this community to create a post.
        </div>

        // </li>
      )}
      <PostFeed initialPosts={community.posts} communityName={community.name} />
    </>
  );
};

export default page;
