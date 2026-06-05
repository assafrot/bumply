"use server";

import { revalidatePath } from "next/cache";
import {
  addFoodEntry,
  addWaterCup,
  deleteFoodEntry,
  deleteWaterEntry,
  reorderFoodEntries,
  toggleCompletion,
} from "@/lib/db";
import type { MealType } from "@/lib/types";
import { ensureAuth } from "./auth";

export async function toggleChecklistItem(
  checklistItemId: string,
  completed: boolean
) {
  const user = await ensureAuth();
  await toggleCompletion(user.id, checklistItemId, completed);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function logWaterCup() {
  const user = await ensureAuth();
  await addWaterCup(user.id);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function removeWaterEntry(entryId: string) {
  await ensureAuth();
  await deleteWaterEntry(entryId);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function logFood(name: string, meal: MealType) {
  const user = await ensureAuth();
  await addFoodEntry(user.id, name, meal);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function removeFoodEntry(entryId: string) {
  await ensureAuth();
  await deleteFoodEntry(entryId);
  revalidatePath("/");
  revalidatePath("/history");
}

export async function reorderFood(orderedIds: string[]) {
  await ensureAuth();
  await reorderFoodEntries(orderedIds);
  revalidatePath("/");
  revalidatePath("/history");
}
