import { AppHeader } from "@/components/layout/app-header";
import { ChecklistManager } from "@/components/settings/checklist-manager";
import { ProfileForm } from "@/components/settings/profile-form";
import { SignOutButton } from "@/components/settings/sign-out-button";
import { ensureAuth } from "@/lib/actions/auth";
import { getChecklistItems, getProfile } from "@/lib/db";
import { he } from "@/lib/i18n/he";

export default async function SettingsPage() {
  const user = await ensureAuth();
  const [profile, checklistItems] = await Promise.all([
    getProfile(user.id),
    getChecklistItems(user.id, { activeOnly: false }),
  ]);

  if (!profile) {
    return <p className="p-4 text-muted-foreground">{he.common.loadingProfile}</p>;
  }

  return (
    <div className="space-y-4 pb-6">
      <AppHeader profile={profile} subtitle={he.subtitles.settings} />
      <div className="px-4 space-y-4">
        <ProfileForm profile={profile} />
        <ChecklistManager
          title={he.settings.dailyTasks}
          type="task"
          items={checklistItems}
        />
        <ChecklistManager
          title={he.settings.vitamins}
          type="vitamin"
          items={checklistItems}
        />
        <SignOutButton />
      </div>
    </div>
  );
}
