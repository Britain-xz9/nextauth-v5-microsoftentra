import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/database/mongoAdapter";
import authConfig from "./auth.config";
import type { Adapter } from "next-auth/adapters";

// configuration for NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client, {
    databaseName: "next-auth-v5",
  }) as Adapter,
  debug: process.env.NODE_ENV === "development",
});
