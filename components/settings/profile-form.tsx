"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { he } from "@/lib/i18n/he";
import { saveProfileSettings } from "@/lib/actions/settings";
import type { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="border-rose-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{he.settings.profile}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={(formData) => {
            startTransition(async () => {
              await saveProfileSettings(formData);
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="due_date">{he.settings.dueDate}</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              defaultValue={profile.due_date ?? ""}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? he.settings.saving : he.settings.save}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
