import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = { adminId?: string; customerId?: string };
const password = process.env.SESSION_PASSWORD;
if (!password || password.length < 32) {
  throw new Error("SESSION_PASSWORD must be at least 32 characters.");
}
const options: SessionOptions = {
  cookieName: "coffee_stamp_session",
  password,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }
};
export async function getSession() {
  return getIronSession<SessionData>(await cookies(), options);
}
