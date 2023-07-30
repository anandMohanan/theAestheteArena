import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import { UserDropdown } from "./UserDropdown";
import { SearchBar } from "./SearchBar";
import Image from "next/image";

export const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-primary-colour  z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center lg:w-60">
          {/* <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6  lg:h-4 lg:w-4" /> */}
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            The Aesthete's Arena
          </p>
        </Link>
        <SearchBar />
        {session?.user ? (
          <UserDropdown user={session.user} />
        ) : (
          <Link href="/signIn" className={`w-40 ${buttonVariants()}`}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};
