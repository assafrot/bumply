import { createNeonAuth } from "@neondatabase/auth/next/server";

// Placeholders allow `next build` without .env.local; set real values for runtime.
export const auth = createNeonAuth({
  baseUrl:
    process.env.NEON_AUTH_BASE_URL ??
    "https://placeholder.neonauth.local/auth",
  cookies: {
    secret:
      process.env.NEON_AUTH_COOKIE_SECRET ??
      "build-time-placeholder-secret-32chars-min",
  },
});
