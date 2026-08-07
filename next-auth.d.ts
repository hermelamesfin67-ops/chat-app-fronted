import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      access: string;
      user: {
        username: string;
        email: string;
        role: string;
        account_type: string;
      };
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: {
      access: string;
      user: {
        username: string;
        email: string;
        role: string;
        account_type: string;
      };
    } & DefaultSession["user"];
  }
}
