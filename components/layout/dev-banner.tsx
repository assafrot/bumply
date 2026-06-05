import { isMemoryDb } from "@/lib/db/config";
import { he } from "@/lib/i18n/he";

export function DevBanner() {
  if (!isMemoryDb()) return null;

  return (
    <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 text-center text-xs text-amber-900">
      {he.dev.memoryBanner}
    </div>
  );
}
