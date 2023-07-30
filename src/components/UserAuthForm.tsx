"use client";

import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

export const UserAuthForm: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const googleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google").catch((e) => console.log("aaaa", e));
    } catch (error) {
      console.log("eeeeeeeeee", error);

      toast({
        title: "There was a problem.",
        description: "There was an error logging in with google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex justify-center")}>
      <Button
        onClick={googleLogin}
        isLoading={isLoading}
        size="sm"
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};
