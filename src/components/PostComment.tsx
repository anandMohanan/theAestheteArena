"use client";

import { useRef, useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { PostCommentVoteClient } from "./CommentVotes";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostcommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
  hide: boolean;
}

export const Postcomment = ({
  comment,
  votesAmt,
  currentVote,
  postId,
  hide,
}: PostcommentProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            {comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <PostCommentVoteClient
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />
      </div>
    </div>
  );
};
