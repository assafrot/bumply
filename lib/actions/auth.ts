"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getCurrentUserId } from "@/lib/db";

export async function ensureAuth() {
  const userId = await getCurrentUserId();
  return { id: userId };
}

export async function logout() {
  await auth.signOut();
  redirect("/auth/sign-in");
}
