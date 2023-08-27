import Link from "next/link";
import { Icons } from "./Icons";
import { UserAuthForm } from "./UserAuthForm";
import Image from "next/image";

export const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={80}
          height={80}
          className="mx-auto"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          Login with your google account to create communities and post.
        </p>

        <UserAuthForm />
        <p className="px-8 text-center text-sm text-zinc-700">
          New to Taa?
          <Link
            href="signUp"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
