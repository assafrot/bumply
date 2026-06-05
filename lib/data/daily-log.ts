import { format } from "date-fns";
import { WATER_GOAL_CUPS } from "@/lib/constants";
import { getSql } from "@/lib/db/client";
import { normalizeRow, normalizeRows } from "@/lib/db/normalize";
import type {
  DailyLog,
  DaySummary,
  FoodEntry,
  LogCompletion,
  MealType,
  Profile,
  TodayData,
  WaterEntry,
} from "@/lib/types";
import { getChecklistItems } from "./checklist";
import { getProfile } from "./profile";

export function todayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export async function getOrCreateDailyLog(
  userId: string,
  logDate: string = todayDateString()
): Promise<DailyLog> {
  const sql = getSql();

  const existing = await sql`
    select *
    from daily_logs
    where user_id = ${userId} and log_date = ${logDate}
  `;

  if (existing.length > 0) {
    return normalizeRow(existing[0]) as DailyLog;
  }

  const rows = await sql`
    insert into daily_logs (user_id, log_date)
    values (${userId}, ${logDate})
    returning *
  `;

  return normalizeRow(rows[0]) as DailyLog;
}

export async function getTodayData(userId: string): Promise<TodayData> {
  const profile = await getProfile(userId);
  if (!profile) throw new Error("Profile not found");

  const dailyLog = await getOrCreateDailyLog(userId);
  const checklistItems = await getChecklistItems(userId);
  const sql = getSql();

  const [completions, waterEntries, foodEntries] = await Promise.all([
    sql`select * from log_completions where daily_log_id = ${dailyLog.id}`,
    sql`
      select id, daily_log_id, logged_at
      from water_entries
      where daily_log_id = ${dailyLog.id}
      order by logged_at desc
    `,
    sql`
      select *
      from food_entries
      where daily_log_id = ${dailyLog.id}
      order by sort_order asc
    `,
  ]);

  return {
    profile,
    dailyLog,
    checklistItems,
    completions: normalizeRows(completions) as LogCompletion[],
    waterEntries: normalizeRows(waterEntries) as WaterEntry[],
    foodEntries: normalizeRows(foodEntries) as FoodEntry[],
  };
}

export async function toggleCompletion(
  userId: string,
  checklistItemId: string,
  completed: boolean,
  logDate: string = todayDateString()
): Promise<void> {
  const dailyLog = await getOrCreateDailyLog(userId, logDate);
  const sql = getSql();

  await sql`
    insert into log_completions (daily_log_id, checklist_item_id, completed)
    values (${dailyLog.id}, ${checklistItemId}, ${completed})
    on conflict (daily_log_id, checklist_item_id)
    do update set completed = ${completed}
  `;
}

export async function addWaterCup(
  userId: string,
  logDate: string = todayDateString()
): Promise<WaterEntry> {
  const dailyLog = await getOrCreateDailyLog(userId, logDate);
  const sql = getSql();

  const rows = await sql`
    insert into water_entries (daily_log_id)
    values (${dailyLog.id})
    returning id, daily_log_id, logged_at
  `;

  return normalizeRow(rows[0]) as WaterEntry;
}

export async function deleteWaterEntry(entryId: string): Promise<void> {
  const sql = getSql();
  await sql`delete from water_entries where id = ${entryId}`;
}

export async function addFoodEntry(
  userId: string,
  name: string,
  meal: MealType,
  logDate: string = todayDateString()
): Promise<FoodEntry> {
  const dailyLog = await getOrCreateDailyLog(userId, logDate);
  const sql = getSql();

  const lastEntry = await sql`
    select sort_order
    from food_entries
    where daily_log_id = ${dailyLog.id}
    order by sort_order desc
    limit 1
  `;

  const sort_order = ((lastEntry[0]?.sort_order as number | undefined) ?? -1) + 1;

  const rows = await sql`
    insert into food_entries (daily_log_id, name, meal, sort_order)
    values (${dailyLog.id}, ${name}, ${meal}::meal_type, ${sort_order})
    returning *
  `;

  return normalizeRow(rows[0]) as FoodEntry;
}

export async function reorderFoodEntries(orderedIds: string[]): Promise<void> {
  const sql = getSql();
  await Promise.all(
    orderedIds.map((id, sort_order) =>
      sql`update food_entries set sort_order = ${sort_order} where id = ${id}`
    )
  );
}

export async function deleteFoodEntry(entryId: string): Promise<void> {
  const sql = getSql();
  await sql`delete from food_entries where id = ${entryId}`;
}

export async function getDayData(
  userId: string,
  logDate: string
): Promise<TodayData | null> {
  const profile = await getProfile(userId);
  if (!profile) return null;

  const sql = getSql();
  const dailyLogs = await sql`
    select *
    from daily_logs
    where user_id = ${userId} and log_date = ${logDate}
  `;

  const checklistItems = await getChecklistItems(userId);

  if (dailyLogs.length === 0) {
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

  const dailyLog = normalizeRow(dailyLogs[0]) as DailyLog;

  const [completions, waterEntries, foodEntries] = await Promise.all([
    sql`select * from log_completions where daily_log_id = ${dailyLog.id}`,
    sql`
      select id, daily_log_id, logged_at
      from water_entries
      where daily_log_id = ${dailyLog.id}
      order by logged_at desc
    `,
    sql`
      select *
      from food_entries
      where daily_log_id = ${dailyLog.id}
      order by sort_order asc
    `,
  ]);

  return {
    profile,
    dailyLog,
    checklistItems,
    completions: normalizeRows(completions) as LogCompletion[],
    waterEntries: normalizeRows(waterEntries) as WaterEntry[],
    foodEntries: normalizeRows(foodEntries) as FoodEntry[],
  };
}

export async function getHistorySummaries(
  userId: string,
  days: number = 30
): Promise<DaySummary[]> {
  const profile = await getProfile(userId);
  if (!profile) return [];

  const checklistItems = await getChecklistItems(userId);
  const tasksTotal = checklistItems.filter((i) => i.type === "task").length;
  const vitaminsTotal = checklistItems.filter((i) => i.type === "vitamin").length;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  const startDateStr = format(startDate, "yyyy-MM-dd");

  const sql = getSql();
  const logs = normalizeRows(
    await sql`
      select id, log_date
      from daily_logs
      where user_id = ${userId} and log_date >= ${startDateStr}
      order by log_date desc
    `
  );

  const summaries: DaySummary[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const logDate = format(date, "yyyy-MM-dd");
    const log = logs.find((l) => l.log_date === logDate);

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

    const [waterRes, foodRes, completionsRes] = await Promise.all([
      sql`select id from water_entries where daily_log_id = ${log.id}`,
      sql`select id from food_entries where daily_log_id = ${log.id}`,
      sql`
        select checklist_item_id, completed
        from log_completions
        where daily_log_id = ${log.id} and completed = true
      `,
    ]);

    const completedIds = new Set(
      completionsRes.map((c) => c.checklist_item_id as string)
    );

    summaries.push({
      logDate,
      dailyLogId: log.id as string,
      waterCups: waterRes.length,
      waterGoalCups: WATER_GOAL_CUPS,
      foodEntryCount: foodRes.length,
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

export function computeDayStats(data: TodayData) {
  const completionMap = new Map(
    data.completions.map((c) => [c.checklist_item_id, c.completed])
  );

  const tasks = data.checklistItems.filter((i) => i.type === "task");
  const vitamins = data.checklistItems.filter((i) => i.type === "vitamin");

  return {
    tasksCompleted: tasks.filter((t) => completionMap.get(t.id)).length,
    tasksTotal: tasks.length,
    vitaminsCompleted: vitamins.filter((v) => completionMap.get(v.id)).length,
    vitaminsTotal: vitamins.length,
    waterCups: data.waterEntries.length,
    foodEntryCount: data.foodEntries.length,
  };
}

export function daysUntilDue(profile: Profile): number | null {
  if (!profile.due_date) return null;
  const due = new Date(profile.due_date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}
