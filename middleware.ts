/*
// middleware in Next.js
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(request);

  return NextResponse.redirect(new URL("/about", request.url));
}
  */

//middleware in NextAuth/Auth.js
import { auth } from "@/app/_lib/auth";
export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
