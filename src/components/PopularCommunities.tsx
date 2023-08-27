import { db } from "@/lib/db";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";

export const PopularCommunities = async () => {
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
    <div className="mt-6 bg-deep-champagne ">
      <div className="bg-deep-champagne px-6 py-4">
        <p className="font-semibold py-3 flex items-center gap-1.5">
          {/* <HomeIcon className="h-4 w-4" /> */}
          Popular communities
        </p>
      </div>
      <dl className="-my-3   bg-deep-champagne  px-6 py-4 text-sm leading-6">
        {communityNames.map((community) => {
          return (
            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
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
