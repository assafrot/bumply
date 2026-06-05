"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { he } from "@/lib/i18n/he";
import { reorderFood, removeFoodEntry } from "@/lib/actions/today";
import type { FoodEntry, MealType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { he as heLocale } from "date-fns/locale";

function mealLabel(meal: MealType) {
  return he.foodDiary.meals[meal];
}

interface SortableFoodItemProps {
  entry: FoodEntry;
  readOnly: boolean;
  isPending: boolean;
  onDelete: (id: string) => void;
}

function SortableFoodItem({
  entry,
  readOnly,
  isPending,
  onDelete,
}: SortableFoodItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 text-sm rounded-lg bg-muted/50 px-3 py-2",
        isDragging && "opacity-60 shadow-md z-10"
      )}
    >
      {!readOnly ? (
        <button
          type="button"
          className="touch-none text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 -m-1"
          aria-label={he.foodDiary.dragHandle}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      ) : null}
      <div className="flex-1 min-w-0">
        <p className="font-medium">{entry.name}</p>
        <p className="text-xs text-muted-foreground">
          {mealLabel(entry.meal)} ·{" "}
          {format(parseISO(entry.logged_at), "HH:mm", { locale: heLocale })}
        </p>
      </div>
      {!readOnly ? (
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isPending}
          onClick={() => onDelete(entry.id)}
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      ) : null}
    </li>
  );
}

interface FoodDiaryListProps {
  entries: FoodEntry[];
  readOnly?: boolean;
}

export function FoodDiaryList({ entries, readOnly = false }: FoodDiaryListProps) {
  const [optimisticItems, setOptimisticItems] = useState<FoodEntry[] | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const items = optimisticItems ?? entries;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setOptimisticItems(reordered);
    startTransition(async () => {
      await reorderFood(reordered.map((item) => item.id));
      setOptimisticItems(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await removeFoodEntry(id);
    });
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{he.foodDiary.empty}</p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {items.map((entry) => (
            <SortableFoodItem
              key={entry.id}
              entry={entry}
              readOnly={readOnly}
              isPending={isPending}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
