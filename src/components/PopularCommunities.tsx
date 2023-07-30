import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";

export const PopularCommunities = async () => {
  const session = await getAuthSession();
  const communityNames = await db.community.findMany({
    orderBy: {
      subscriber: {
        _count: "desc",
      },
    },
    take: 5,
  });

  return (
    // <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
    <div className="mt-6">
      <div className="bg-emerald-100 px-6 py-4">
        <p className="font-semibold py-3 flex items-center gap-1.5">
          {/* <HomeIcon className="h-4 w-4" /> */}
          Popular communities
        </p>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <p className="text-zinc-500">
            Your personal Breadit frontpage. Come here to check in with your
            favorite communities.
          </p>
        </div>
        {communityNames.map((community) => {
          return (
            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href={`/w/community/${community.name}`}
            >
              {community.name}
            </Link>
          );
        })}
      </dl>
    </div>
  );
};