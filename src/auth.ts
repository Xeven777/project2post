import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  pages: {
    signIn: "/auth/github",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
