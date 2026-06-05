import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { he } from "@/lib/i18n/he";
import type { DaySummary } from "@/lib/types";
import { formatHistoryDate, isToday } from "@/lib/utils/dates";

interface DayCardProps {
  summary: DaySummary;
}

export function DayCard({ summary }: DayCardProps) {
  const dateLabel = isToday(summary.logDate)
    ? he.history.today
    : formatHistoryDate(summary.logDate);

  const waterPct =
    summary.waterGoalCups > 0
      ? Math.min(100, (summary.waterCups / summary.waterGoalCups) * 100)
      : 0;

  const hasActivity =
    summary.dailyLogId !== null &&
    (summary.waterCups > 0 ||
      summary.foodEntryCount > 0 ||
      summary.tasksCompleted > 0 ||
      summary.vitaminsCompleted > 0);

  const content = (
    <Card
      className={`border-rose-100 transition-colors ${
        hasActivity ? "hover:bg-rose-50/50" : "opacity-70"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="font-medium">{dateLabel}</p>
            {!hasActivity ? (
              <p className="text-xs text-muted-foreground">{he.history.noActivity}</p>
            ) : null}
          </div>
          {hasActivity ? (
            <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">{he.history.water}</span>
              <span>{he.history.cups(summary.waterCups)}</span>
            </div>
            <Progress value={waterPct} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">{he.history.foodDiary}</span>
              <span>{he.history.meals(summary.foodEntryCount)}</span>
            </div>
            <Progress
              value={summary.foodEntryCount > 0 ? 100 : 0}
              className="h-1.5"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Badge variant="secondary">
            {he.history.tasks(summary.tasksCompleted, summary.tasksTotal)}
          </Badge>
          <Badge variant="secondary">
            {he.history.vitamins(
              summary.vitaminsCompleted,
              summary.vitaminsTotal
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (!hasActivity) return content;

  return (
    <Link href={`/history/${summary.logDate}`} className="block">
      {content}
    </Link>
  );
}
