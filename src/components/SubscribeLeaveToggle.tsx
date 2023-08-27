"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToCommunityPayload } from "@/lib/validators/communities";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  communityId: string;
  communityName: string;
  isSubscribed: boolean;
}

export const SubscribeLeaveToggle = ({
  communityId,
  communityName,
  isSubscribed,
}: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: subscribeToCommunity, isLoading: isSubscriptionLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToCommunityPayload = {
          communityId,
        };

        const { data } = await axios.post("/api/community/subscribe", payload);
        return data as string;
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
        startTransition(() => {
          router.refresh();
        });

        return toast({
          title: "Subscribed",
          description: `You are subscribed to ${communityName}`,
        });
      },
    });

  const { mutate: leaveCommunity, isLoading: isLeavingLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToCommunityPayload = {
        communityId,
      };

      const { data } = await axios.post("/api/community/leave", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      console.log(err);

      return loginToast();
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are unsubscribed from ${communityName}`,
      });
    },
  });
  return isSubscribed ? (
    <Button
      onClick={() => leaveCommunity()}
      isLoading={isLeavingLoading}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubscriptionLoading}
      onClick={() => subscribeToCommunity()}
    >
      Join community
    </Button>
  );
};
