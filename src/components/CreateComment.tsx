"use client";

import { useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

export const CreateComment = ({
  postId,
  replyToId,
}: {
  postId: string;
  replyToId?: string;
}) => {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
      };

      const { data } = await axios.post(`/api/community/post/comment`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return loginToast();
    },

    onSuccess: () => {
      router.refresh();
      setInput("");
    },
  });
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment"> Your comment </Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts"
        />
        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input?.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
