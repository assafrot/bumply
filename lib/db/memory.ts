import { randomUUID } from "crypto";
import { format } from "date-fns";
import { WATER_GOAL_CUPS } from "@/lib/constants";
import type {
  ChecklistItem,
  ChecklistItemType,
  DailyLog,
  DaySummary,
  FoodEntry,
  LogCompletion,
  MealType,
  Profile,
  TodayData,
  WaterEntry,
} from "@/lib/types";
import { LOCAL_USER_ID } from "./config";

interface MemoryState {
  profile: Profile;
  checklistItems: ChecklistItem[];
  dailyLogs: DailyLog[];
  completions: LogCompletion[];
  waterEntries: WaterEntry[];
  foodEntries: FoodEntry[];
}

function defaultProfile(): Profile {
  return {
    id: LOCAL_USER_ID,
    due_date: null,
    created_at: new Date().toISOString(),
  };
}

function createDefaultState(): MemoryState {
  return {
    profile: defaultProfile(),
    checklistItems: [],
    dailyLogs: [],
    completions: [],
    waterEntries: [],
    foodEntries: [],
  };
}

const globalForDb = globalThis as unknown as { bumplyMemoryDb?: MemoryState };

function state(): MemoryState {
  if (!globalForDb.bumplyMemoryDb) {
    globalForDb.bumplyMemoryDb = createDefaultState();
  }
  return globalForDb.bumplyMemoryDb;
}

export function memoryGetProfile(userId: string): Profile | null {
  if (userId !== LOCAL_USER_ID) return null;
  return { ...state().profile };
}

export function memoryUpdateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "due_date">>
): Profile {
  const s = state();
  if (userId !== LOCAL_USER_ID) throw new Error("User not found");
  s.profile = { ...s.profile, ...updates };
  return { ...s.profile };
}

export function memoryGetChecklistItems(
  userId: string,
  options?: { activeOnly?: boolean; type?: ChecklistItemType }
): ChecklistItem[] {
  let items = state().checklistItems.filter((i) => i.user_id === userId);
  if (options?.activeOnly !== false) items = items.filter((i) => i.active);
  if (options?.type) items = items.filter((i) => i.type === options.type);
  return items
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({ ...i }));
}

export function memoryCreateChecklistItem(
  userId: string,
  name: string,
  type: ChecklistItemType
): ChecklistItem {
  const s = state();
  const existing = memoryGetChecklistItems(userId, { activeOnly: false, type });
  const maxOrder = existing.reduce((max, item) => Math.max(max, item.sort_order), -1);
  const item: ChecklistItem = {
    id: randomUUID(),
    user_id: userId,
    name,
    type,
    sort_order: maxOrder + 1,
    active: true,
    created_at: new Date().toISOString(),
  };
  s.checklistItems.push(item);
  return { ...item };
}

export function memoryUpdateChecklistItem(
  itemId: string,
  updates: Partial<Pick<ChecklistItem, "name" | "sort_order" | "active">>
): ChecklistItem {
  const s = state();
  const index = s.checklistItems.findIndex((i) => i.id === itemId);
  if (index === -1) throw new Error("Checklist item not found");
  s.checklistItems[index] = { ...s.checklistItems[index], ...updates };
  return { ...s.checklistItems[index] };
}

export function memoryArchiveChecklistItem(itemId: string): void {
  memoryUpdateChecklistItem(itemId, { active: false });
}

function memoryTodayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function memoryGetOrCreateDailyLog(
  userId: string,
  logDate: string = memoryTodayDateString()
): DailyLog {
  const s = state();
  const existing = s.dailyLogs.find(
    (l) => l.user_id === userId && l.log_date === logDate
  );
  if (existing) return { ...existing };

  const log: DailyLog = {
    id: randomUUID(),
    user_id: userId,
    log_date: logDate,
    created_at: new Date().toISOString(),
  };
  s.dailyLogs.push(log);
  return { ...log };
}

function memoryGetDayLogData(
  dailyLog: DailyLog
): Pick<TodayData, "completions" | "waterEntries" | "foodEntries"> {
  const s = state();
  return {
    completions: s.completions
      .filter((c) => c.daily_log_id === dailyLog.id)
      .map((c) => ({ ...c })),
    waterEntries: s.waterEntries
      .filter((e) => e.daily_log_id === dailyLog.id)
      .sort(
        (a, b) =>
          new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      )
      .map((e) => ({ ...e })),
    foodEntries: s.foodEntries
      .filter((e) => e.daily_log_id === dailyLog.id)
      .sort((a, b) => {
        const orderA = a.sort_order ?? 0;
        const orderB = b.sort_order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return (
          new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
        );
      })
      .map((e) => ({ ...e })),
  };
}

export function memoryGetTodayData(userId: string): TodayData {
  const profile = memoryGetProfile(userId);
  if (!profile) throw new Error("Profile not found");

  const dailyLog = memoryGetOrCreateDailyLog(userId);
  const checklistItems = memoryGetChecklistItems(userId);
  const logData = memoryGetDayLogData(dailyLog);

  return {
    profile,
    dailyLog,
    checklistItems,
    ...logData,
  };
}

export function memoryToggleCompletion(
  userId: string,
  checklistItemId: string,
  completed: boolean,
  logDate: string = memoryTodayDateString()
): void {
  const s = state();
  const dailyLog = memoryGetOrCreateDailyLog(userId, logDate);
  const index = s.completions.findIndex(
    (c) =>
      c.daily_log_id === dailyLog.id &&
      c.checklist_item_id === checklistItemId
  );

  if (index === -1) {
    s.completions.push({
      daily_log_id: dailyLog.id,
      checklist_item_id: checklistItemId,
      completed,
    });
  } else {
    s.completions[index].completed = completed;
  }
}

export function memoryAddWaterCup(
  userId: string,
  logDate: string = memoryTodayDateString()
): WaterEntry {
  const s = state();
  const dailyLog = memoryGetOrCreateDailyLog(userId, logDate);
  const entry: WaterEntry = {
    id: randomUUID(),
    daily_log_id: dailyLog.id,
    logged_at: new Date().toISOString(),
  };
  s.waterEntries.push(entry);
  return { ...entry };
}

export function memoryDeleteWaterEntry(entryId: string): void {
  const s = state();
  s.waterEntries = s.waterEntries.filter((e) => e.id !== entryId);
}

export function memoryAddFoodEntry(
  userId: string,
  name: string,
  meal: MealType,
  logDate: string = memoryTodayDateString()
): FoodEntry {
  const s = state();
  const dailyLog = memoryGetOrCreateDailyLog(userId, logDate);
  const dayEntries = s.foodEntries.filter((e) => e.daily_log_id === dailyLog.id);
  const maxOrder = dayEntries.reduce(
    (max, e) => Math.max(max, e.sort_order ?? 0),
    -1
  );
  const entry: FoodEntry = {
    id: randomUUID(),
    daily_log_id: dailyLog.id,
    name,
    meal,
    sort_order: maxOrder + 1,
    logged_at: new Date().toISOString(),
  };
  s.foodEntries.push(entry);
  return { ...entry };
}

export function memoryReorderFoodEntries(orderedIds: string[]): void {
  const s = state();
  orderedIds.forEach((id, index) => {
    const entry = s.foodEntries.find((e) => e.id === id);
    if (entry) entry.sort_order = index;
  });
}

export function memoryDeleteFoodEntry(entryId: string): void {
  const s = state();
  s.foodEntries = s.foodEntries.filter((e) => e.id !== entryId);
}

export function memoryGetDayData(
  userId: string,
  logDate: string
): TodayData | null {
  const profile = memoryGetProfile(userId);
  if (!profile) return null;

  const s = state();
  const dailyLog = s.dailyLogs.find(
    (l) => l.user_id === userId && l.log_date === logDate
  );
  const checklistItems = memoryGetChecklistItems(userId);

  if (!dailyLog) {
    return {
      profile,
      dailyLog: {
        id: "",
        user_id: userId,
        log_date: logDate,
        created_at: "",
      },
      checklistItems,
      completions: [],
      waterEntries: [],
      foodEntries: [],
    };
  }

  const logData = memoryGetDayLogData(dailyLog);
  return {
    profile,
    dailyLog: { ...dailyLog },
    checklistItems,
    ...logData,
  };
}

export function memoryGetHistorySummaries(
  userId: string,
  days: number = 30
): DaySummary[] {
  const profile = memoryGetProfile(userId);
  if (!profile) return [];

  const checklistItems = memoryGetChecklistItems(userId);
  const tasksTotal = checklistItems.filter((i) => i.type === "task").length;
  const vitaminsTotal = checklistItems.filter((i) => i.type === "vitamin").length;
  const s = state();
  const summaries: DaySummary[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const logDate = format(date, "yyyy-MM-dd");
    const log = s.dailyLogs.find(
      (l) => l.user_id === userId && l.log_date === logDate
    );

    if (!log) {
      summaries.push({
        logDate,
        dailyLogId: null,
        waterCups: 0,
        waterGoalCups: WATER_GOAL_CUPS,
        foodEntryCount: 0,
        tasksCompleted: 0,
        tasksTotal,
        vitaminsCompleted: 0,
        vitaminsTotal,
      });
      continue;
    }

    const completedIds = new Set(
      s.completions
        .filter((c) => c.daily_log_id === log.id && c.completed)
        .map((c) => c.checklist_item_id)
    );

    summaries.push({
      logDate,
      dailyLogId: log.id,
      waterCups: s.waterEntries.filter((e) => e.daily_log_id === log.id).length,
      waterGoalCups: WATER_GOAL_CUPS,
      foodEntryCount: s.foodEntries.filter((e) => e.daily_log_id === log.id)
        .length,
      tasksCompleted: checklistItems.filter(
        (item) => item.type === "task" && completedIds.has(item.id)
      ).length,
      tasksTotal,
      vitaminsCompleted: checklistItems.filter(
        (item) => item.type === "vitamin" && completedIds.has(item.id)
      ).length,
      vitaminsTotal,
    });
  }

  return summaries;
}
