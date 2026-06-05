import { DayCard } from "@/components/history/day-card";
import { AppHeader } from "@/components/layout/app-header";
import { ensureAuth } from "@/lib/actions/auth";
import { getHistorySummaries, getProfile } from "@/lib/db";
import { he } from "@/lib/i18n/he";

export default async function HistoryPage() {
  const user = await ensureAuth();
  const profile = await getProfile(user.id);
  const summaries = await getHistorySummaries(user.id, 30);

  if (!profile) {
    return <p className="p-4 text-muted-foreground">{he.common.loadingProfile}</p>;
  }

  return (
    <div className="space-y-4 pb-6">
      <AppHeader profile={profile} subtitle={he.subtitles.past30Days} />
      <div className="px-4 space-y-3">
        {summaries.map((summary) => (
          <DayCard key={summary.logDate} summary={summary} />
        ))}
      </div>
    </div>
  );
}
