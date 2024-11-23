"use server";

import { signIn, signOut } from "./auth";

interface AuthOptions {
  redirectTo: string;
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/account" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
