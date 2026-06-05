"use client";

import { useTransition } from "react";
import { ListChecks, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { he } from "@/lib/i18n/he";
import { toggleChecklistItem } from "@/lib/actions/today";
import type { ChecklistItem, ChecklistItemType, LogCompletion } from "@/lib/types";

interface ChecklistSectionProps {
  type: ChecklistItemType;
  items: ChecklistItem[];
  completions: LogCompletion[];
  readOnly?: boolean;
}

export function ChecklistSection({
  type,
  items,
  completions,
  readOnly = false,
}: ChecklistSectionProps) {
  const [isPending, startTransition] = useTransition();
  const completionMap = new Map(
    completions.map((c) => [c.checklist_item_id, c.completed])
  );

  const filtered = items.filter((item) => item.type === type);
  const title = type === "task" ? he.checklist.tasks : he.checklist.vitamins;
  const Icon = type === "task" ? ListChecks : Pill;
  const iconColor = type === "task" ? "text-violet-600" : "text-emerald-600";

  return (
    <Card className="mx-4 border-rose-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">{he.checklist.empty}</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((item) => {
              const checked = completionMap.get(item.id) ?? false;
              return (
                <li key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={item.id}
                    checked={checked}
                    disabled={readOnly || isPending}
                    onCheckedChange={(value) => {
                      startTransition(async () => {
                        await toggleChecklistItem(item.id, value === true);
                      });
                    }}
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-sm flex-1 cursor-pointer ${
                      checked ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.name}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
