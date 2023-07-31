import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/Providers";

export const metadata = {
  title: "Taa",
  description:
    "The aesthete's arena is a community to portray writing,visual art,internet culture research and beyond.",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-primary-colour text-slate-900 antialiased light",
        inter.className
      )}
    >
      <link rel="icon" href="/logo.png" type="image/icon type" />
      <body className="min-h-screen pt-12 bg-primary-colour antialiased">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />
          {authModal}
          <div className="container max-w-7xl mx-auto h-full pt-12">
            {children}{" "}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
