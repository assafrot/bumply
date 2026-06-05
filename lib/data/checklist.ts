import { getSql } from "@/lib/db/client";
import { normalizeRow, normalizeRows } from "@/lib/db/normalize";
import type { ChecklistItem, ChecklistItemType } from "@/lib/types";

export async function getChecklistItems(
  userId: string,
  options?: { activeOnly?: boolean; type?: ChecklistItemType }
): Promise<ChecklistItem[]> {
  const sql = getSql();
  const activeOnly = options?.activeOnly !== false;
  const type = options?.type ?? null;

  const rows = await sql`
    select *
    from checklist_items
    where user_id = ${userId}
      and (${activeOnly} = false or active = true)
      and (${type}::checklist_item_type is null or type = ${type}::checklist_item_type)
    order by sort_order asc
  `;

  return normalizeRows(rows) as ChecklistItem[];
}

export async function createChecklistItem(
  userId: string,
  name: string,
  type: ChecklistItemType
): Promise<ChecklistItem> {
  const existing = await getChecklistItems(userId, {
    activeOnly: false,
    type,
  });
  const maxOrder = existing.reduce(
    (max, item) => Math.max(max, item.sort_order),
    -1
  );

  const sql = getSql();
  const rows = await sql`
    insert into checklist_items (user_id, name, type, sort_order)
    values (${userId}, ${name}, ${type}::checklist_item_type, ${maxOrder + 1})
    returning *
  `;

  return normalizeRow(rows[0]) as ChecklistItem;
}

export async function updateChecklistItem(
  itemId: string,
  updates: Partial<Pick<ChecklistItem, "name" | "sort_order" | "active">>
): Promise<ChecklistItem> {
  const sql = getSql();
  const rows = await sql`
    update checklist_items
    set
      name = coalesce(${updates.name ?? null}, name),
      sort_order = coalesce(${updates.sort_order ?? null}, sort_order),
      active = coalesce(${updates.active ?? null}, active)
    where id = ${itemId}
    returning *
  `;

  if (rows.length === 0) throw new Error("Checklist item not found");
  return normalizeRow(rows[0]) as ChecklistItem;
}

export async function archiveChecklistItem(itemId: string): Promise<void> {
  const sql = getSql();
  await sql`
    update checklist_items
    set active = false
    where id = ${itemId}
  `;
}
