"use client";

import { useRef, useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import { PostCommentVoteClient } from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

export const Postcomment = ({
  comment,
  votesAmt,
  currentVote,
  postId,
  hide,
}: {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
  hide: boolean;
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [replying, setIsReplying] = useState(false);
  const [input, setInput] = useState("");

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.post(`/api/community/post/comment`, payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Comment was not posted successfully",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      setIsReplying(false);
      router.refresh();
    },
  });
  return (
    <div ref={commentRef} className="flex flex-col">
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
            u/{comment.author.username}
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
