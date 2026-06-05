import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WATER_GOAL_CUPS } from "@/lib/constants";
import { he } from "@/lib/i18n/he";
import { CupSoda, ListChecks, Pill, UtensilsCrossed } from "lucide-react";

interface SummaryCardsProps {
  waterCups: number;
  waterGoalCups?: number;
  foodEntryCount: number;
  tasksCompleted: number;
  tasksTotal: number;
  vitaminsCompleted: number;
  vitaminsTotal: number;
}

function pct(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

export function SummaryCards({
  waterCups,
  waterGoalCups = WATER_GOAL_CUPS,
  foodEntryCount,
  tasksCompleted,
  tasksTotal,
  vitaminsCompleted,
  vitaminsTotal,
}: SummaryCardsProps) {
  const waterPct = pct(waterCups, waterGoalCups);

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <Card className="border-rose-100 bg-gradient-to-br from-sky-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sky-700 mb-2">
            <CupSoda className="h-4 w-4" />
            <span className="text-xs font-medium">{he.summary.water}</span>
          </div>
          <p className="text-2xl font-semibold text-sky-900">{waterPct}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {he.summary.cupsOf(waterCups, waterGoalCups)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-rose-100 bg-gradient-to-br from-orange-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="text-xs font-medium">{he.summary.foodDiary}</span>
          </div>
          <p className="text-2xl font-semibold text-orange-900">
            {foodEntryCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {he.summary.mealsToday(foodEntryCount)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-rose-100 bg-gradient-to-br from-violet-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-violet-700 mb-2">
            <ListChecks className="h-4 w-4" />
            <span className="text-xs font-medium">{he.summary.tasks}</span>
          </div>
          <p className="text-2xl font-semibold text-violet-900">
            {tasksCompleted}/{tasksTotal}
          </p>
          <Progress
            value={tasksTotal ? (tasksCompleted / tasksTotal) * 100 : 0}
            className="mt-2 h-1.5"
          />
        </CardContent>
      </Card>

      <Card className="border-rose-100 bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-emerald-700 mb-2">
            <Pill className="h-4 w-4" />
            <span className="text-xs font-medium">{he.summary.vitamins}</span>
          </div>
          <p className="text-2xl font-semibold text-emerald-900">
            {vitaminsCompleted}/{vitaminsTotal}
          </p>
          <Progress
            value={vitaminsTotal ? (vitaminsCompleted / vitaminsTotal) * 100 : 0}
            className="mt-2 h-1.5"
          />
        </CardContent>
      </Card>
    </div>
  );
}
