"use server";

import { revalidatePath } from "next/cache";
import {
  archiveChecklistItem,
  createChecklistItem,
  updateChecklistItem,
  updateProfile,
} from "@/lib/db";
import type { ChecklistItemType } from "@/lib/types";
import { ensureAuth } from "./auth";

export async function saveProfileSettings(formData: FormData) {
  const user = await ensureAuth();

  const dueDate = formData.get("due_date") as string;

  await updateProfile(user.id, {
    due_date: dueDate || null,
  });

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/history");
}

export async function addChecklistItem(name: string, type: ChecklistItemType) {
  const user = await ensureAuth();
  await createChecklistItem(user.id, name.trim(), type);
  revalidatePath("/");
  revalidatePath("/settings");
}

export async function renameChecklistItem(itemId: string, name: string) {
  await ensureAuth();
  await updateChecklistItem(itemId, { name: name.trim() });
  revalidatePath("/");
  revalidatePath("/settings");
}

export async function removeChecklistItem(itemId: string) {
  await ensureAuth();
  await archiveChecklistItem(itemId);
  revalidatePath("/");
  revalidatePath("/settings");
}
