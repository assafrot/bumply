const ALLOWED_EMAILS = new Set([
  "assafrot@gmail.com",
  "shai.rozenblat@gmail.com",
]);

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.has(email.trim().toLowerCase());
}
