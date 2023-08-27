import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { UserCheck2 } from "lucide-react";

export const FollowingCommunities = async () => {
  const session = await getAuthSession();
  const communityNames = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      community: true,
    },
  });

  return (
    // <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
    <div className="mt-6">
      <div className="bg-deep-champagne px-6 py-2">
        <p className="font-semibold py-3 flex items-center gap-1.5">
          <UserCheck2 className="h-4 w-4" />
          Following Communities
        </p>
      </div>
      <dl className="-my-3  px-6 py-4 text-sm leading-6 bg-deep-champagne">
        <div className="flex justify-between gap-x-4 py-3">
          <p className="text-black">The Communities which you follow.</p>
        </div>
        {communityNames.map(({ community }) => {
          return (
            <Link
              className={buttonVariants({
                className: " mt-2 mb-2 mr-2",
              })}
              href={`/w/community/${community.name}`}
              key={community.id}
            >
              {community.name}
            </Link>
          );
        })}
      </dl>
    </div>
  );
};
