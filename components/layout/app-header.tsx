import { daysUntilDue } from "@/lib/data/daily-log";
import { he } from "@/lib/i18n/he";
import type { Profile } from "@/lib/types";

interface AppHeaderProps {
  profile: Profile;
  subtitle?: string;
}

export function AppHeader({ profile, subtitle }: AppHeaderProps) {
  const daysLeft = daysUntilDue(profile);

  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-rose-900">
            {he.appName}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          ) : null}
        </div>
        {daysLeft !== null ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-100 px-3 py-2 text-start shrink-0">
            <p className="text-xs text-rose-600 font-medium">{he.header.dueDate}</p>
            <p className="text-sm font-semibold text-rose-900">
              {daysLeft > 0
                ? he.header.daysToGo(daysLeft)
                : daysLeft === 0
                  ? he.header.dueToday
                  : he.header.daysAgo(Math.abs(daysLeft))}
            </p>
          </div>
        ) : null}
      </div>
    </header>
  );
}
