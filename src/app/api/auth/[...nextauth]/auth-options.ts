/* eslint-disable @typescript-eslint/no-explicit-any */
import { routes } from "@/lib/routes";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {},
      async authorize(_, req) {
        if (req.body) {
          if (Buffer.byteLength(req.body.data, "utf8") > 15 * 1024) {
            throw new Error("Invalid request format");
          }
          return JSON.parse(req.body.data);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // session expire after the user in active for 15 min
  },
  jwt: {
    maxAge: 15 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.access_token = session.token;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Fallback
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: routes.signIn,
  },
};
