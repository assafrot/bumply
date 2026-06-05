export type ChecklistItemType = "task" | "vitamin";

export interface Profile {
  id: string;
  due_date: string | null;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  name: string;
  type: ChecklistItemType;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  created_at: string;
}

export interface LogCompletion {
  daily_log_id: string;
  checklist_item_id: string;
  completed: boolean;
}

export interface WaterEntry {
  id: string;
  daily_log_id: string;
  logged_at: string;
}

export type MealType = "breakfast" | "snack" | "lunch" | "evening" | "night";

export interface FoodEntry {
  id: string;
  daily_log_id: string;
  name: string;
  meal: MealType;
  sort_order: number;
  logged_at: string;
}

export interface DaySummary {
  logDate: string;
  dailyLogId: string | null;
  waterCups: number;
  waterGoalCups: number;
  foodEntryCount: number;
  tasksCompleted: number;
  tasksTotal: number;
  vitaminsCompleted: number;
  vitaminsTotal: number;
}

export interface TodayData {
  profile: Profile;
  dailyLog: DailyLog;
  checklistItems: ChecklistItem[];
  completions: LogCompletion[];
  waterEntries: WaterEntry[];
  foodEntries: FoodEntry[];
}
