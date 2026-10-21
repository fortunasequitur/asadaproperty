import { Navigate } from "react-router";

export { LoginPage } from "./LoginPage";
export { SettingsPage } from "./SettingsPage";
export { SignupPage } from "./SignupPage";

/** `/dashboard`: sign-in lands here; the app's home is the leads admin. */
export function DashboardPage() {
  return <Navigate to="/admin" replace />;
}
