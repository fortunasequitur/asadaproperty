import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { OAUTH_CALLBACK_PATH } from "@/auth/oauthReturn";
import { SpaceSession } from "@/auth/SpaceSession";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicLayout } from "@/components/PublicLayout";
import { PublicOnlyRoute } from "@/components/PublicOnlyRoute";
import { DashboardPage, LoginPage, SettingsPage, SignupPage } from "@/pages";

const LandingPage = lazy(() =>
  import("@/landing/LandingPage").then(m => ({ default: m.LandingPage })),
);
const AdminLeadsPage = lazy(() => import("@/admin/AdminLeadsPage"));

import { ViktorOAuthCallbackPage } from "@/pages/ViktorOAuthCallbackPage";

export function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense
              fallback={<div className="min-h-screen bg-forest-deep" />}
            >
              <LandingPage />
            </Suspense>
          }
        />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      {/* Return leg of "Sign in with Viktor" — outside the auth guards
          because it owns the loading/outcome handling itself. */}
      <Route path={OAUTH_CALLBACK_PATH} element={<ViktorOAuthCallbackPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<p className="p-6 text-sm">Memuat…</p>}>
                <AdminLeadsPage />
              </Suspense>
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function AuthenticatedAppRoutes() {
  return (
    <SpaceSession>
      <AuthenticatedRoutes />
    </SpaceSession>
  );
}
