import { NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signIn",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      const findUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!findUser) {
        token.id = user.id;
        return token;
      }

      if (!findUser.username) {
        await db.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }
      return {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        picture: findUser.image,
        username: findUser.username,
      };
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
