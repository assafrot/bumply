import { format } from "date-fns";

function toDateString(value: unknown): string {
  if (value instanceof Date) return format(value, "yyyy-MM-dd");
  return String(value);
}

function toTimestampString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/** Neon returns Postgres date/timestamptz columns as JS Date objects. */
export function normalizeRow<T>(row: T): T {
  if (!row || typeof row !== "object") return row;

  const out = { ...(row as Record<string, unknown>) };

  for (const [key, value] of Object.entries(out)) {
    if (!(value instanceof Date)) continue;

    if (key.endsWith("_date") || key === "log_date" || key === "due_date") {
      out[key] = toDateString(value);
    } else if (key.endsWith("_at")) {
      out[key] = toTimestampString(value);
    }
  }

  return out as T;
}

export function normalizeRows<T>(rows: T[]): T[] {
  return rows.map(normalizeRow);
}
