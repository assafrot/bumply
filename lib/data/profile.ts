import { getSql } from "@/lib/db/client";
import { normalizeRow } from "@/lib/db/normalize";
import type { Profile } from "@/lib/types";

export async function ensureProfile(userId: string): Promise<void> {
  const sql = getSql();
  await sql`
    insert into profiles (id)
    values (${userId})
    on conflict (id) do nothing
  `;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const sql = getSql();
  const rows = await sql`
    select id, due_date, created_at
    from profiles
    where id = ${userId}
  `;
  if (rows.length === 0) return null;
  return normalizeRow(rows[0]) as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "due_date">>
): Promise<Profile | null> {
  const sql = getSql();
  const rows = await sql`
    update profiles
    set due_date = coalesce(${updates.due_date ?? null}, due_date)
    where id = ${userId}
    returning id, due_date, created_at
  `;
  if (rows.length === 0) return null;
  return normalizeRow(rows[0]) as Profile;
}
