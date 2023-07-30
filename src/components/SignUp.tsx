import Link from "next/link";
import { Icons } from "./Icons";
import { UserAuthForm } from "./UserAuthForm";

export const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt eaque
          atque nostrum nobis ratione ea quis doloremque est, vel odit
          similique.
        </p>

        <UserAuthForm />
        <p className="px-8 text-center text-sm text-zinc-700">
          Already a user?
          <Link
            href="signIn"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
