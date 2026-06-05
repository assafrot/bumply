import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { he } from "@/lib/i18n/he";

export function SignOutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="outline"
        className="w-full border-rose-200 text-rose-800"
      >
        {he.auth.signOut}
      </Button>
    </form>
  );
}
