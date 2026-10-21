import path from "node:path";
import react from "@vitejs/plugin-react";
import { createServer, type Plugin } from "vite";

/**
 * Landing-page load path:
 *  1. The landing page sits two lazy hops from the entry (auth strategy →
 *     routes → page). Preload those chunks from index.html so the hero
 *     renders after one round trip instead of three.
 *  2. Render the header + hero to static HTML at build time and put it into
 *     index.html's #vpa-shell, so first paint (and LCP) does not wait for JS.
 */
export function preloadLandingPlugin(root: string): Plugin {
  const targets = [
    "auth/authenticated/AuthenticatedAppRoutes.tsx",
    "landing/LandingPage.tsx",
  ];
  return {
    name: "preload-landing",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      async handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        const files = new Set<string>();
        const add = (fileName: string) => {
          const c = bundle[fileName];
          if (!c || c.type !== "chunk" || files.has(fileName)) return;
          files.add(fileName);
          for (const imp of c.imports) add(imp);
        };
        for (const chunk of Object.values(bundle)) {
          if (
            chunk.type === "chunk" &&
            targets.some(t => chunk.facadeModuleId?.endsWith(t))
          ) {
            add(chunk.fileName);
          }
        }
        const tags = [...files]
          .filter(f => !html.includes(f))
          .map(f => `    <link rel="modulepreload" crossorigin href="/${f}">`)
          .join("\n");
        // Preload the two Latin font files so the hero's text does not reflow
        // when the web fonts swap in.
        const fonts = Object.values(bundle)
          .filter(
            a =>
              a.type === "asset" &&
              /(cormorant-garamond|plus-jakarta-sans)-latin-wght-normal.*\.woff2$/.test(a.fileName),
          )
          .map(
            a =>
              `    <link rel="preload" as="font" type="font/woff2" crossorigin href="/${a.fileName}">`,
          )
          .join("\n");
        let out = html.replace("</head>", `${fonts}\n${tags}\n  </head>`);

        let shell = "";
        const server = await createServer({
          configFile: false,
          root,
          logLevel: "error",
          plugins: [react()],
          resolve: { alias: { "@": path.resolve(root, "src") } },
          server: { middlewareMode: true, hmr: false, ws: false },
          appType: "custom",
          optimizeDeps: { noDiscovery: true, include: [] },
        });
        try {
          const mod = await server.ssrLoadModule("/src/landing/ShellEntry.tsx");
          shell = (mod as { render: () => string }).render();
        } catch (error) {
          console.warn("[preload-landing] hero shell render failed:", error);
        } finally {
          await server.close();
        }
        out = out.replace("<!--vpa-shell-->", shell);
        return out;
      },
    },
  };
}
