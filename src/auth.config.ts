import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    MicrosoftEntraId({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: { signOut: "/auth/login", error: "/error" },
  callbacks: {
    // jwt
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token._id = user.id;
        token.role = user.role || "student"; // default to student if no role
      }

      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        token.access_token = account.access_token;
      }

      return token;
    },

    // session
    async session({ token, session }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user._id = token.id as string;
        session.user.role =
          (token.role as "admin" | "student" | "dev") || "student";
        session.user.access_token = token.access_token as string;
        session.user.provider = token.provider as string;
        session.user.providerAccountId = token.providerAccountId as string;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
