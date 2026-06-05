import { ChecklistSection } from "@/components/checklists/checklist-section";
import { AppHeader } from "@/components/layout/app-header";
import { FoodDiary } from "@/components/today/food-diary";
import { SummaryCards } from "@/components/today/summary-cards";
import { WaterTracker } from "@/components/today/water-tracker";
import { ensureAuth } from "@/lib/actions/auth";
import { computeDayStats } from "@/lib/data/daily-log";
import { getTodayData } from "@/lib/db";
import { formatDisplayDate } from "@/lib/utils/dates";

export default async function TodayPage() {
  const user = await ensureAuth();
  const data = await getTodayData(user.id);
  const stats = computeDayStats(data);

  return (
    <div className="space-y-4 pb-6">
      <AppHeader
        profile={data.profile}
        subtitle={formatDisplayDate(data.dailyLog.log_date)}
      />

      <SummaryCards
        waterCups={stats.waterCups}
        foodEntryCount={stats.foodEntryCount}
        tasksCompleted={stats.tasksCompleted}
        tasksTotal={stats.tasksTotal}
        vitaminsCompleted={stats.vitaminsCompleted}
        vitaminsTotal={stats.vitaminsTotal}
      />

      <div className="space-y-4">
        <WaterTracker entries={data.waterEntries} cupCount={stats.waterCups} />
        <FoodDiary entries={data.foodEntries} />
        <ChecklistSection
          type="task"
          items={data.checklistItems}
          completions={data.completions}
        />
        <ChecklistSection
          type="vitamin"
          items={data.checklistItems}
          completions={data.completions}
        />
      </div>
    </div>
  );
}
