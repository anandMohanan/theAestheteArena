"use client";

import { INFINITY_SCROLLING_PAGINATION_VALUE } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { PostComponent } from "./Post";
export const PostFeed = ({
  initialPosts,
  communityName,
}: {
  initialPosts: ExtendedPost[];
  communityName?: string;
}) => {
  const { data: session } = useSession();
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITY_SCROLLING_PAGINATION_VALUE}&page=${pageParam}` +
        (!!communityName ? `&communityName=${communityName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, i) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (i === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <PostComponent
                commentAmt={post.comments.length}
                communityName={post.community.name}
                post={post}
                currentVote={currentVote}
                votesAmt={votesAmt}
              />
            </li>
          );
        } else {
          return (
            <PostComponent
              commentAmt={post.comments.length}
              communityName={post.community.name}
              post={post}
              currentVote={currentVote}
              votesAmt={votesAmt}
              key={post.id}
            />
          );
        }
      })}
    </ul>
  );
};
