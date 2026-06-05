"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { he } from "@/lib/i18n/he";
import {
  addChecklistItem,
  removeChecklistItem,
  renameChecklistItem,
} from "@/lib/actions/settings";
import type { ChecklistItem, ChecklistItemType } from "@/lib/types";

interface ChecklistManagerProps {
  title: string;
  type: ChecklistItemType;
  items: ChecklistItem[];
}

export function ChecklistManager({ title, type, items }: ChecklistManagerProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((item) => item.type === type && item.active);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    startTransition(async () => {
      await addChecklistItem(newName, type);
      setNewName("");
    });
  }

  return (
    <Card className="border-rose-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            placeholder={he.settings.addPlaceholder}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={isPending}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">{he.settings.noItems}</p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
              >
                {editingId === item.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8"
                    />
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await renameChecklistItem(item.id, editName);
                          setEditingId(null);
                        })
                      }
                    >
                      {he.settings.saveItem}
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{item.name}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      onClick={() => {
                        setEditingId(item.id);
                        setEditName(item.name);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(async () => {
                          await removeChecklistItem(item.id);
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
