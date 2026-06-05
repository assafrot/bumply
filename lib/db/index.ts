import { isMemoryDb, LOCAL_USER_ID } from "./config";
import * as memory from "./memory";

export { LOCAL_USER_ID, isMemoryDb };

export async function getCurrentUserId(): Promise<string> {
  if (isMemoryDb()) return LOCAL_USER_ID;

  const { requireAllowedSession } = await import("@/lib/auth/session");
  const { ensureProfile } = await import("@/lib/data/profile");

  const session = await requireAllowedSession();
  await ensureProfile(session.user.id);
  return session.user.id;
}

export async function getProfile(userId: string) {
  if (isMemoryDb()) return memory.memoryGetProfile(userId);
  const { getProfile: dbGetProfile } = await import("@/lib/data/profile");
  return dbGetProfile(userId);
}

export async function updateProfile(
  userId: string,
  updates: Parameters<typeof memory.memoryUpdateProfile>[1]
) {
  if (isMemoryDb()) return memory.memoryUpdateProfile(userId, updates);
  const { updateProfile: dbUpdateProfile } = await import("@/lib/data/profile");
  return dbUpdateProfile(userId, updates);
}

export async function getChecklistItems(
  userId: string,
  options?: Parameters<typeof memory.memoryGetChecklistItems>[1]
) {
  if (isMemoryDb()) return memory.memoryGetChecklistItems(userId, options);
  const { getChecklistItems: dbGetChecklistItems } = await import(
    "@/lib/data/checklist"
  );
  return dbGetChecklistItems(userId, options);
}

export async function createChecklistItem(
  userId: string,
  name: string,
  type: Parameters<typeof memory.memoryCreateChecklistItem>[2]
) {
  if (isMemoryDb()) return memory.memoryCreateChecklistItem(userId, name, type);
  const { createChecklistItem: dbCreateChecklistItem } = await import(
    "@/lib/data/checklist"
  );
  return dbCreateChecklistItem(userId, name, type);
}

export async function updateChecklistItem(
  itemId: string,
  updates: Parameters<typeof memory.memoryUpdateChecklistItem>[1]
) {
  if (isMemoryDb()) return memory.memoryUpdateChecklistItem(itemId, updates);
  const { updateChecklistItem: dbUpdateChecklistItem } = await import(
    "@/lib/data/checklist"
  );
  return dbUpdateChecklistItem(itemId, updates);
}

export async function archiveChecklistItem(itemId: string) {
  if (isMemoryDb()) return memory.memoryArchiveChecklistItem(itemId);
  const { archiveChecklistItem: dbArchiveChecklistItem } = await import(
    "@/lib/data/checklist"
  );
  return dbArchiveChecklistItem(itemId);
}

export async function getTodayData(userId: string) {
  if (isMemoryDb()) return memory.memoryGetTodayData(userId);
  const { getTodayData: dbGetTodayData } = await import("@/lib/data/daily-log");
  return dbGetTodayData(userId);
}

export async function toggleCompletion(
  userId: string,
  checklistItemId: string,
  completed: boolean
) {
  if (isMemoryDb()) {
    return memory.memoryToggleCompletion(userId, checklistItemId, completed);
  }
  const { toggleCompletion: dbToggleCompletion } = await import(
    "@/lib/data/daily-log"
  );
  return dbToggleCompletion(userId, checklistItemId, completed);
}

export async function addWaterCup(userId: string) {
  if (isMemoryDb()) return memory.memoryAddWaterCup(userId);
  const { addWaterCup: dbAddWaterCup } = await import("@/lib/data/daily-log");
  return dbAddWaterCup(userId);
}

export async function deleteWaterEntry(entryId: string) {
  if (isMemoryDb()) return memory.memoryDeleteWaterEntry(entryId);
  const { deleteWaterEntry: dbDeleteWaterEntry } = await import(
    "@/lib/data/daily-log"
  );
  return dbDeleteWaterEntry(entryId);
}

export async function addFoodEntry(
  userId: string,
  name: string,
  meal: Parameters<typeof memory.memoryAddFoodEntry>[2]
) {
  if (isMemoryDb()) return memory.memoryAddFoodEntry(userId, name, meal);
  const { addFoodEntry: dbAddFoodEntry } = await import("@/lib/data/daily-log");
  return dbAddFoodEntry(userId, name, meal);
}

export async function deleteFoodEntry(entryId: string) {
  if (isMemoryDb()) return memory.memoryDeleteFoodEntry(entryId);
  const { deleteFoodEntry: dbDeleteFoodEntry } = await import(
    "@/lib/data/daily-log"
  );
  return dbDeleteFoodEntry(entryId);
}

export async function reorderFoodEntries(orderedIds: string[]) {
  if (isMemoryDb()) return memory.memoryReorderFoodEntries(orderedIds);
  const { reorderFoodEntries: dbReorderFoodEntries } = await import(
    "@/lib/data/daily-log"
  );
  return dbReorderFoodEntries(orderedIds);
}

export async function getDayData(userId: string, logDate: string) {
  if (isMemoryDb()) return memory.memoryGetDayData(userId, logDate);
  const { getDayData: dbGetDayData } = await import("@/lib/data/daily-log");
  return dbGetDayData(userId, logDate);
}

export async function getHistorySummaries(userId: string, days: number = 30) {
  if (isMemoryDb()) return memory.memoryGetHistorySummaries(userId, days);
  const { getHistorySummaries: dbGetHistorySummaries } = await import(
    "@/lib/data/daily-log"
  );
  return dbGetHistorySummaries(userId, days);
}
