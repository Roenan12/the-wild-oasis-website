"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

interface AuthOptions {
  redirectTo: string;
}

export async function updateGuest(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID") as string | null;
  const nationalityData = formData.get("nationality");
  const nationalIDRegex = /^[a-zA-Z0-9]{6,12}$/;

  // Ensure nationalID and nationalityData are strings
  if (typeof nationalID !== "string" || typeof nationalityData !== "string")
    throw new Error("Invalid form data");

  // Validate nationalID
  if (!nationalID || !nationalIDRegex.test(nationalID)) {
    throw new Error(
      "Please provide a valid national ID. Must be 6-12 alphanumeric characters."
    );
  }

  const [nationality, countryFlag] = nationalityData.split("%");

  const updateData = { nationality, countryFlag, nationalID };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/account" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
