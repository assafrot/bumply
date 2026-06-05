import { NextResponse, type NextRequest } from "next/server";
import { isMemoryDb } from "@/lib/db/config";

export async function proxy(request: NextRequest) {
  if (isMemoryDb()) {
    return NextResponse.next();
  }

  if (request.headers.has("Next-Action")) {
    return NextResponse.next();
  }

  const { auth } = await import("@/lib/auth/server");
  const { isEmailAllowed } = await import("@/lib/auth/allowlist");

  const authMiddleware = auth.middleware({
    loginUrl: "/auth/sign-in",
  });

  const response = await authMiddleware(request);

  const { data: session } = await auth.getSession();
  if (session?.user?.email && !isEmailAllowed(session.user.email)) {
    await auth.signOut();
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=unauthorized", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/history/:path*",
    "/settings/:path*",
  ],
};
