"use client";

import { useTransition } from "react";
import { CupSoda } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WATER_GOAL_CUPS } from "@/lib/constants";
import { he } from "@/lib/i18n/he";
import { logWaterCup, removeWaterEntry } from "@/lib/actions/today";
import type { WaterEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WaterTrackerProps {
  entries: WaterEntry[];
  cupCount: number;
  goalCups?: number;
  readOnly?: boolean;
}

export function WaterTracker({
  entries,
  cupCount,
  goalCups = WATER_GOAL_CUPS,
  readOnly = false,
}: WaterTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const pct = goalCups > 0 ? Math.min(100, (cupCount / goalCups) * 100) : 0;
  const atGoal = cupCount >= goalCups;

  function addCup() {
    if (atGoal) return;
    startTransition(async () => {
      await logWaterCup();
    });
  }

  return (
    <Card className="mx-4 border-rose-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CupSoda className="h-4 w-4 text-sky-600" />
          {he.water.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">
              {he.water.cupsOf(cupCount, goalCups)}
            </span>
            <span className="text-muted-foreground">{Math.round(pct)}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: goalCups }, (_, i) => {
            const filled = i < cupCount;
            return (
              <button
                key={i}
                type="button"
                disabled={readOnly || isPending || (!filled && atGoal)}
                onClick={() => {
                  if (readOnly) return;
                  if (filled) {
                    const entry = entries[cupCount - 1 - i];
                    if (entry) {
                      startTransition(async () => {
                        await removeWaterEntry(entry.id);
                      });
                    }
                  } else if (i === cupCount) {
                    addCup();
                  }
                }}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-2 transition-colors",
                  filled
                    ? "border-sky-300 bg-sky-100 text-sky-700"
                    : "border-dashed border-muted-foreground/30 bg-muted/30 text-muted-foreground",
                  !readOnly && "hover:border-sky-400 cursor-pointer",
                  (readOnly || isPending) && "cursor-default"
                )}
              >
                <CupSoda className={cn("h-5 w-5", filled && "fill-sky-200")} />
                <span className="text-[10px] mt-1">{i + 1}</span>
              </button>
            );
          })}
        </div>

        {!readOnly ? (
          <Button
            className="w-full"
            variant="outline"
            disabled={isPending || atGoal}
            onClick={addCup}
          >
            <CupSoda className="h-4 w-4 me-2" />
            {he.water.drankCup}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
