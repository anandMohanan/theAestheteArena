import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to sign in first ",
      variant: "destructive",
      action: (
        <Link
          href={"/signIn"}
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          Sign in
        </Link>
      ),
    });
  };
  return { loginToast };
};
