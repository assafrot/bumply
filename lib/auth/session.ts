import { redirect } from "next/navigation";
import { isEmailAllowed } from "@/lib/auth/allowlist";
import { auth } from "@/lib/auth/server";

export async function requireAllowedSession() {
  const { data: session } = await auth.getSession();

  if (!session?.user?.email) {
    redirect("/auth/sign-in");
  }

  if (!isEmailAllowed(session.user.email)) {
    await auth.signOut();
    redirect("/auth/sign-in?error=unauthorized");
  }

  return session;
}
