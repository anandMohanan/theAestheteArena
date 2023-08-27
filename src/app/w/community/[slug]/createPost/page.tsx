import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Taa - Create Post",
  description: "Create post page",
};

const page = async ({ params }: { params: { slug: string } }) => {
  const community = await db.community.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!community) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-deep-champagne pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post in
          </h3>
          <p className="ml-2 mt-1 truncate text-xl text-primary-text font-bold ">
            {params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor communityId={community.id} />

      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="post-form">
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
