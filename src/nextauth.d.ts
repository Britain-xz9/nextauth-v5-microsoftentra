import { DefaultUser, DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// extend default session types
declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      role: "admin" | "student" | "dev";
    } & DefaultSession["user"];
  }

  // extend default user types
  interface User extends DefaultUser {
    _id?: string;
    role?: "admin" | "student" | "dev";
    access_token?: string;
    provider?: string;
    providerAccountId?: string;
  }

  // extend default account types
  interface Account extends DefaultAccount {
    access_token?: string;
    provider?: string;
    providerAccountId?: string;
  }
}

// extend default JWT types
interface JWT extends DefaultJWT {
  _id?: string;
  role?: "admin" | "student" | "dev";
  access_token?: string;
  provider?: string;
  providerAccountId?: string;
}
