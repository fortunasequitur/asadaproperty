import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { captureAttribution } from "./landing/tracking";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "./index.css";
// Side-effect import, in the entry chunk on purpose: installed modules
// (src/modules/<name>/) run their entry code before the lazy route chunks
// mount. See src/modules/registry.ts.
import "./modules/registry";

// After a redeploy, a tab opened on the old build requests lazy chunks that
// no longer exist. Reload once to pick up the new build; a second failure
// within the window is a real error and reaches the error boundary.
const CHUNK_RELOAD_KEY = "viktor:chunk-reload-at";
const CHUNK_RELOAD_WINDOW_MS = 60_000;
window.addEventListener("vite:preloadError", event => {
  try {
    const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY));
    if (Date.now() - last < CHUNK_RELOAD_WINDOW_MS) return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

// Keep the ad click params (utm_*, fbclid, gclid, ttclid) from the very first
// URL, before any router or auth code rewrites the address bar.
captureAttribution();

// The static hero shell in index.html only belongs to the landing page.
const shell = document.getElementById("vpa-shell");
if (shell) {
  if (window.location.pathname !== "/") shell.remove();
  else (window as unknown as { __vpaShell?: boolean }).__vpaShell = true;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
