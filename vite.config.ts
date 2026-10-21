import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { buildInputsStampPlugin } from "./scripts/build-inputs.ts";
import { preloadLandingPlugin } from "./scripts/preload-landing.ts";
import { site } from "./src/config/site.ts";
import {
  builtAccessModePlugin,
  describeOverrides,
  descriptorBuildEnv,
  readDescriptorAuth,
} from "./scripts/space-access-mode.ts";

export default defineConfig(({ mode }) => {
  const root = import.meta.dirname;
  const env = loadEnv(mode, root, "VITE_");
  const overrides = descriptorBuildEnv(readDescriptorAuth(root), env);
  const note = describeOverrides(overrides, env);
  if (note) console.log(note);
  // Vite gives variables already in process.env priority over .env files.
  Object.assign(process.env, overrides);
  // Hosts outside Viktor (e.g. Vercel) may build without VITE_CONVEX_URL;
  // fall back to the production Convex backend (public URL, not a secret).
  if (!env.VITE_CONVEX_URL && !process.env.VITE_CONVEX_URL) {
    process.env.VITE_CONVEX_URL = site.convexUrlFallback;
    console.log(`VITE_CONVEX_URL not set; using ${site.convexUrlFallback}`);
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      buildInputsStampPlugin(root),
      builtAccessModePlugin(root),
      preloadLandingPlugin(root),
      {
        // Absolute URLs for og:image / canonical / JSON-LD come from site.ts.
        name: "site-url",
        transformIndexHtml: {
          order: "pre",
          handler: html => html.replaceAll("__SITE_URL__", site.siteUrl),
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(root, "src"),
      },
    },
  };
});
