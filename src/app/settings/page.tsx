import { UserNameForm } from "@/components/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Manage account",
};

const page = async ({}) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/signIn");
  }

  console.log(session);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl mb-6">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session.user.id,
            username: session.user.username || "",
            image: session.user.image,
          }}
        />
      </div>
    </div>
  );
};

export default page;
