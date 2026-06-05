"use client";

import { useState, useTransition } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FoodDiaryList } from "@/components/today/food-diary-list";
import { he } from "@/lib/i18n/he";
import { logFood } from "@/lib/actions/today";
import { defaultMealForNow, MEAL_TYPES } from "@/lib/meals";
import type { FoodEntry, MealType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FoodDiaryProps {
  entries: FoodEntry[];
  readOnly?: boolean;
}

function mealLabel(meal: MealType) {
  return he.foodDiary.meals[meal];
}

export function FoodDiary({ entries, readOnly = false }: FoodDiaryProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [meal, setMeal] = useState<MealType>(defaultMealForNow());
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setName("");
    setMeal(defaultMealForNow());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      await logFood(name.trim(), meal);
      resetForm();
      setOpen(false);
    });
  }

  return (
    <Card className="mx-4 border-rose-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-600" />
            {he.foodDiary.title}
          </CardTitle>
          {!readOnly ? (
            <Sheet
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (next) setMeal(defaultMealForNow());
              }}
            >
              <SheetTrigger
                render={
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 me-1" />
                    {he.foodDiary.addEntry}
                  </Button>
                }
              />
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>{he.foodDiary.logMeal}</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 px-1">
                  <div className="space-y-2">
                    <Label htmlFor="food-meal">{he.foodDiary.meal}</Label>
                    <select
                      id="food-meal"
                      value={meal}
                      onChange={(e) => setMeal(e.target.value as MealType)}
                      className={cn(
                        "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none",
                        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      )}
                    >
                      {MEAL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {mealLabel(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="food-name">{he.foodDiary.whatAte}</Label>
                    <Input
                      id="food-name"
                      placeholder={he.foodDiary.placeholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {he.foodDiary.save}
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {he.foodDiary.entryCount(entries.length)}
        </p>
        <FoodDiaryList entries={entries} readOnly={readOnly} />
      </CardContent>
    </Card>
  );
}
