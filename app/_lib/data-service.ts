import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { notFound } from "next/navigation";

export type Cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount?: number;
  description?: string;
  image?: string;
};

export type Guest = {
  id: number;
  fullName?: string;
  email?: string;
  nationalID: string;
  nationality: string;
  countryFlag: string;
};

type BookingCabinDetails = {
  name: string;
  image: string;
};

export type Booking = {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  cabins: BookingCabinDetails;
};

export type Settings = {
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
};

// type NewGuest = Omit<Guest, "id"> & {
//   fullName: string | null | undefined;
//   email: string | null | undefined;
// };

type NewBooking = Omit<Booking, "id">;

export async function getCabin(id: number): Promise<Cabin | null> {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(
  id: string
): Promise<Pick<Cabin, "regularPrice" | "discount"> | null> {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function (): Promise<Cabin[]> {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data || [];
};

// export async function getGuest(
//   email: string | null | undefined
// ): Promise<Guest | null> {
//   const { data, error } = await supabase
//     .from("guests")
//     .select("*")
//     .eq("email", email)
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be loaded");
//   }

//   return data;
// }

export async function getGuest(
  email: string | null | undefined
): Promise<Guest | null> {
  try {
    console.log("Checking for guest with email:", email);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      // No guest found
      console.warn("No guest found with email:", email);
      return null;
    }

    if (error) {
      console.error("Unexpected getGuest error:", error);
      throw new Error("Error fetching guest");
    }

    return data;
  } catch (error) {
    console.error("getGuest failed:", error);
    throw error;
  }
}

export async function getBooking(id: number): Promise<Booking | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId: number): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  if (!data) return [];

  const bookings: Booking[] = data.map((booking) => ({
    ...booking,
    cabins: Array.isArray(booking.cabins) ? booking.cabins[0] : booking.cabins,
  }));

  return bookings;
}

export async function getBookedDatesByCabinId(
  cabinId: number
): Promise<Date[]> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const isoToday = today.toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${isoToday},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  const bookedDates = (data || [])
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getSettings(id: number): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("*").single();

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 5000));

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries(): Promise<
  { name: string; flag: string }[]
> {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

// export async function createGuest(newGuest: NewGuest): Promise<Guest[]> {
//   const { data, error } = await supabase.from("guests").insert([newGuest]);

//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be created");
//   }

//   return data || [];
// }

export async function createGuest(newGuest: {
  email: string;
  fullName: string;
}) {
  try {
    console.log("Creating guest with data:", newGuest);

    const { data, error } = await supabase.from("guests").insert([newGuest]);

    if (error) {
      console.error("createGuest error:", error);
      throw new Error("Guest could not be created");
    }

    console.log("Guest created successfully:", data);
    return data;
  } catch (error) {
    console.error("createGuest failed:", error);
    throw error;
  }
}

export async function createBooking(newBooking: NewBooking): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/*
export async function updateGuest(
  id: string,
  updatedFields: Partial<Guest>
): Promise<Guest> {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  return data;
}

export async function updateBooking(
  id: string,
  updatedFields: Partial<Booking>
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data;
}

export async function deleteBooking(id: number): Promise<Booking[]> {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  return data || [];
}
*/
