import { SubscribeLeaveToggle } from "@/components/SubscribeLeaveToggle";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
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
        },
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

  const memberCount = await db.subscription.count({
    where: {
      community: {
        name: slug,
      },
    },
  });
  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          <div className=" md:block overflow-hidden h-fit rounded-lg border border-black bg-deep-champagne  order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3 underline decoration-wavy decoration-primary-text">
                About {community.name}
              </p>
            </div>
            <dl className=" px-6 py-4 text-sm leading-6 bg-deep-champagne">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-black">Created</dt>
                <dd className="text-gary-700">
                  <time dateTime={community.createdAt.toDateString()}>
                    {format(community.createdAt, "MMMM d, yyyy ")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-black">Members</dt>
                <dd className="text-gary-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {community.cretorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-black">You created this community.</p>
                </div>
              ) : null}

              {community.cretorId !== session?.user.id ? (
                <SubscribeLeaveToggle
                  communityId={community.id}
                  communityName={community.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}

              {isSubscribed ? (
                <Link
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full mb-6",
                  })}
                  href={`w/community/${slug}/createPost`}
                >
                  Create Post
                </Link>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
