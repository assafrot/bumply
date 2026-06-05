import { WATER_GOAL_CUPS } from "@/lib/constants";

export const he = {
  appName: "Bumply",
  nav: {
    today: "היום",
    history: "היסטוריה",
    settings: "הגדרות",
  },
  header: {
    dueDate: "תאריך לידה",
    daysToGo: (n: number) => `עוד ${n} ימים`,
    dueToday: "היום!",
    daysAgo: (n: number) => `לפני ${n} ימים`,
  },
  subtitles: {
    settings: "הגדרות",
    past30Days: "30 הימים האחרונים",
    readOnly: "לצפייה בלבד",
  },
  summary: {
    water: "מים",
    foodDiary: "יומן אוכל",
    tasks: "משימות",
    vitamins: "ויטמינים",
    cupsOf: (current: number, goal: number = WATER_GOAL_CUPS) =>
      `${current} / ${goal} כוסות`,
    mealsToday: (count: number) =>
      count === 0 ? "אין רישומים" : `${count} רישומים היום`,
  },
  water: {
    title: "מים",
    drankCup: "שתיתי כוס מים",
    cupsOf: (current: number, goal: number = WATER_GOAL_CUPS) =>
      `${current} מתוך ${goal} כוסות`,
    cup: "כוס",
    cupNumber: (n: number) => `כוס ${n}`,
  },
  foodDiary: {
    title: "יומן אוכל",
    addEntry: "הוספת רישום",
    logMeal: "מה אכלת?",
    whatAte: "מה אכלת?",
    meal: "ארוחה",
    meals: {
      breakfast: "בוקר",
      snack: "ביניים",
      lunch: "צהריים",
      evening: "ערב",
      night: "לילה",
    },
    placeholder: "לדוגמה: יוגורט עם גרנולה וקפה",
    save: "שמירה",
    empty: "עדיין לא נרשם מה אכלת היום.",
    dragHandle: "גרירה לשינוי סדר",
    entryCount: (count: number) =>
      count === 1 ? "רישום אחד היום" : `${count} רישומים היום`,
  },
  checklist: {
    tasks: "משימות יומיות",
    vitamins: "ויטמינים ותוספים",
    empty: "אין עדיין פריטים. הוסיפי בהגדרות.",
  },
  history: {
    today: "היום",
    noActivity: "אין פעילות",
    water: "מים",
    foodDiary: "יומן אוכל",
    cups: (n: number) => `${n} כוסות`,
    meals: (n: number) => (n === 1 ? "רישום אחד" : `${n} רישומים`),
    tasks: (done: number, total: number) => `משימות ${done}/${total}`,
    vitamins: (done: number, total: number) => `ויטמינים ${done}/${total}`,
  },
  settings: {
    profile: "פרופיל",
    dueDate: "תאריך לידה",
    save: "שמירת הגדרות",
    saving: "שומר...",
    dailyTasks: "משימות יומיות",
    vitamins: "ויטמינים ותוספים",
    addPlaceholder: "הוספת פריט חדש",
    noItems: "אין עדיין פריטים.",
    saveItem: "שמירה",
  },
  auth: {
    signOut: "התנתקות",
    unauthorized: "אין לך הרשאה לגשת לאפליקציה. פנה למנהל המערכת.",
  },
  common: {
    loadingProfile: "טוען פרופיל...",
    close: "סגירה",
  },
  dev: {
    memoryBanner:
      "מצב מקומי — מסד נתונים בזיכרון (הנתונים מתאפסים בעת הפעלה מחדש)",
  },
  meta: {
    title: "Bumply — רשימת משימות יומית להריון",
    description: "מעקב אחר מים, יומן אוכל, משימות יומיות וויטמינים בהריון",
    manifestDescription:
      "רשימת משימות יומית להריון — מים, יומן אוכל, משימות וויטמינים",
  },
} as const;
