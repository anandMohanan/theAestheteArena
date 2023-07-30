import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Postcomment } from "./PostComment";
import { CreateComment } from "./CreateComment";

export const CommentsSection = async ({ postId }: { postId: string }) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
      votes: true,
    },
  });

  return (
    <div className="flex flex-col gp-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 mt-4">
        {comments.map((topLevelComment) => {
          const voteAmt = topLevelComment.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);
          const vote = topLevelComment.votes.find(
            (vote) => vote.userId === session?.user.id
          );

          return (
            <div key={topLevelComment.id} className="flex flex-col">
              <div className="mb-2">
                <Postcomment
                  postId={postId}
                  currentVote={vote}
                  votesAmt={voteAmt}
                  comment={topLevelComment}
                  hide={false}
                />{" "}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
