/**
 * Build-time only: renders the header + hero to static HTML that index.html
 * shows before any JavaScript runs (see scripts/preload-landing.ts). The React
 * app mounts the identical hero underneath and then removes the shell.
 */
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import { renderToStaticMarkup } from "react-dom/server";
import { Header } from "./Header";
import { Hero } from "./Hero";

export function render(): string {
  return renderToStaticMarkup(
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence initial={false}>
        <div className="bg-cream text-ink">
          <Header />
          <main>
            <Hero />
          </main>
        </div>
      </AnimatePresence>
    </LazyMotion>,
  );
}
