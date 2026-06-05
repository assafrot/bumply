"use client";

import { useSearchParams } from "next/navigation";
import { he } from "@/lib/i18n/he";

export function UnauthorizedNotice() {
  const searchParams = useSearchParams();

  if (searchParams.get("error") !== "unauthorized") {
    return null;
  }

  return (
    <p className="mb-4 max-w-sm text-center text-sm text-destructive">
      {he.auth.unauthorized}
    </p>
  );
}
