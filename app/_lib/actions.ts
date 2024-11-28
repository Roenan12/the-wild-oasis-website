"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";

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

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: number): Promise<void> {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/account" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
