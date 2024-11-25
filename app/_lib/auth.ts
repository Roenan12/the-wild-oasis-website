import type { NextAuthConfig, Session } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";
import { NextRequest } from "next/server";

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    authorized({
      auth,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }): boolean {
      return !!auth?.user; // returns a boolean
    },
    async signIn({ user }) {
      console.log("Sign-in user details:", user);

      try {
        const existingGuest = await getGuest(user.email);
        console.log("Existing guest:", existingGuest);

        if (!user.email || !user.name) {
          throw new Error("Email and name is required for creating a guest");
        }

        if (!existingGuest) {
          console.log("Guest does not exist, creating new guest...");
          await createGuest({ email: user.email, fullName: user.name });
        }

        return true; // Sign-in successful
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Sign-in failed
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      if (!guest || guest.id === null) {
        console.error("Guest not found for email:", session.user.email);
        throw new Error("Guest not found");
      }

      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
