import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  MotionConfig,
} from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { captureAttribution, initPixels } from "./tracking";

const BelowFold = lazy(() => import("./BelowFold"));

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let destroyed = false;
    let cleanup = () => {};
    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      const lenis = new Lenis({ duration: 1.1, anchors: { offset: -72 } });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      let raf = 0;
      const loop = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanup = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        (window as unknown as { __lenis?: unknown }).__lenis = undefined;
      };
    };
    const id = setTimeout(() => void start(), 600);
    return () => {
      destroyed = true;
      clearTimeout(id);
      cleanup();
    };
  }, []);
}

const hadShell =
  typeof window !== "undefined" &&
  Boolean((window as unknown as { __vpaShell?: boolean }).__vpaShell);

export function LandingPage() {
  useEffect(() => {
    // The real hero is painted now: drop the static one sitting on top.
    const id = requestAnimationFrame(() =>
      document.getElementById("vpa-shell")?.remove(),
    );
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    captureAttribution();
    initPixels();
  }, []);
  useSmoothScroll();

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="bg-cream text-ink">
          <a
            href="#daftar"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-forest-deep"
          >
            Langsung ke form pendaftaran
          </a>
          <Header />
          <main>
            {/* With the static shell already on screen, skip the hero intro so
                the swap is invisible. */}
            <AnimatePresence initial={!hadShell}>
              <Hero />
            </AnimatePresence>
            <Suspense fallback={<div className="min-h-[100svh]" />}>
              <BelowFold />
            </Suspense>
          </main>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
