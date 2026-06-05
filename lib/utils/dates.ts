import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";

const locale = he;

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE, d בMMMM", { locale });
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "d בMMMM yyyy", { locale });
}

export function formatHistoryDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE, d בMMM", { locale });
}

export function isToday(dateStr: string): boolean {
  return dateStr === format(new Date(), "yyyy-MM-dd");
}
