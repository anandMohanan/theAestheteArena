"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare, TrashIcon } from "lucide-react";
import { useRef } from "react";
import { EditorOutput } from "./EditorOutput";
import { PostVoteClient } from "./postVote/PostVoteClient";
import { Button, buttonVariants } from "./ui/Button";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { DeletePostPayload } from "@/lib/validators/post";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

type PartialVote = Pick<Vote, "type">;

interface PostComponentProps {
  communityName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

export const PostComponent = ({
  communityName,
  post,
  commentAmt,
  votesAmt,
  currentVote,
}: PostComponentProps) => {
  const postRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate: deletePost } = useMutation({
    mutationFn: async ({ postId }: DeletePostPayload) => {
      if (session?.user.id !== post.authorId) return;
      const payload: DeletePostPayload = { postId };
      const { data } = await axios.patch(`/api/community/post/delete`, payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Could not delete Post",
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      router.refresh();
      return toast({
        title: "Post deleted successfully",
        description: "",
        variant: "default",
      });
    },
  });
  return (
    <div className="rounded-md bg-deep-champagne shadow border border-black border-double">
      <div className="px-6 py-4 flex justify-between ">
        <PostVoteClient
          initialVotesAmt={votesAmt}
          postId={post.id}
          initialVote={currentVote?.type}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500 ">
            {communityName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-1"
                  href={`/w/community/${communityName}/`}
                >
                  w/{communityName}
                  <span className="px-1">.</span>
                </a>
              </>
            ) : null}
            <span>Post created by {post.author.username} </span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/w/community/${communityName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-deep-champagne to-transparent" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gry-50 z-20 text-sm p-4 sm:px-6">
        <div className="w-fit flex items-center gap-2">
          <a
            className="w-fit flex items-center gap-2"
            href={`/w/community/${communityName}/post/${post.id}`}
          >
            <MessageSquare className="h-4 w-4" /> {commentAmt}
          </a>
          <hr />
          {post.authorId === session?.user.id ? (
            <a
              className={`w-fit flex items-end gap-2 cursor-pointer `}
              onClick={() => {
                deletePost({ postId: post.id });
              }}
              href={"/"}
            >
              <TrashIcon className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
