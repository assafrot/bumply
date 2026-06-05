export const LOCAL_USER_ID = "00000000-0000-0000-0000-000000000001";

export function isMemoryDb(): boolean {
  if (process.env.USE_MEMORY_DB === "true") return true;
  if (process.env.USE_MEMORY_DB === "false") return false;
  return !process.env.DATABASE_URL;
}
