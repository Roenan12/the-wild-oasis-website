import type { Metadata } from "next";
import { auth } from "../_lib/auth";
import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session: Session | null = await auth();
  const firstName = session?.user?.name?.split(" ").at(0);

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}
    </h2>
  );
}
