import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChecklistSection } from "@/components/checklists/checklist-section";
import { FoodDiary } from "@/components/today/food-diary";
import { WaterTracker } from "@/components/today/water-tracker";
import { Button } from "@/components/ui/button";
import { ensureAuth } from "@/lib/actions/auth";
import { computeDayStats } from "@/lib/data/daily-log";
import { getDayData } from "@/lib/db";
import { he } from "@/lib/i18n/he";
import { formatDisplayDate } from "@/lib/utils/dates";
import { notFound } from "next/navigation";

interface DayDetailPageProps {
  params: Promise<{ date: string }>;
}

export default async function DayDetailPage({ params }: DayDetailPageProps) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const user = await ensureAuth();
  const data = await getDayData(user.id, date);

  if (!data) notFound();

  const stats = computeDayStats(data);
  const readOnly = date !== new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4 pb-6">
      <div className="px-4 pt-6 flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" render={<Link href="/history" />}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{formatDisplayDate(date)}</h1>
          {readOnly ? (
            <p className="text-sm text-muted-foreground">{he.subtitles.readOnly}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <WaterTracker
          entries={data.waterEntries}
          cupCount={stats.waterCups}
          readOnly={readOnly}
        />
        <FoodDiary entries={data.foodEntries} readOnly={readOnly} />
        <ChecklistSection
          type="task"
          items={data.checklistItems}
          completions={data.completions}
          readOnly={readOnly}
        />
        <ChecklistSection
          type="vitamin"
          items={data.checklistItems}
          completions={data.completions}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
