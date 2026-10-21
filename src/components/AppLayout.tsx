import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { LogOut, Settings, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { MountainMark } from "@/landing/MountainMark";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";

/** Signed-in shell for the leads admin. */
export function AppLayout() {
  const user = useQuery(api.auth.currentUser);
  const { signOut } = useAuthActions();
  const link = ({ isActive }: { isActive: boolean }) =>
    cn(
      "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors",
      isActive ? "bg-cream/12 text-gold" : "text-cream/75 hover:text-cream",
    );

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 bg-forest-deep text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 md:px-8">
          <NavLink to="/admin" className="mr-auto flex items-center gap-2">
            <MountainMark className="h-4 text-gold" />
            <span className="font-heading text-lg font-semibold">
              {APP_NAME}
            </span>
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">
              Admin
            </span>
          </NavLink>
          <nav aria-label="Admin" className="flex items-center gap-1">
            <NavLink to="/admin" className={link} end>
              <Users className="size-4" aria-hidden="true" /> Leads
            </NavLink>
            <NavLink to="/settings" className={link} aria-label="Pengaturan">
              <Settings className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Pengaturan</span>
            </NavLink>
            <span className="hidden max-w-48 truncate px-2 text-xs text-cream/55 md:inline">
              {user?.email}
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Keluar"
              className="inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm text-cream/75 hover:text-cream"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
