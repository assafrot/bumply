import type { MealType } from "@/lib/types";

export const MEAL_TYPES: MealType[] = [
  "breakfast",
  "snack",
  "lunch",
  "evening",
  "night",
];

export function defaultMealForNow(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return "breakfast";
  if (hour >= 10 && hour < 12) return "snack";
  if (hour >= 12 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 21) return "evening";
  return "night";
}
