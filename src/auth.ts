import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request proper scopes for accessing repos including private ones
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Pass the GitHub access token to the client side session
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user = {
          ...session.user,
          id: token.sub || "",
        };
      }
      return session;
    },
    async jwt({ token, account }) {
      // Save the access token from initial sign in
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/github",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
