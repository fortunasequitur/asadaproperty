import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "./gallery";

export default function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const img = images[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const next = () => onIndex((index + 1) % images.length);
  const prev = () => onIndex((index - 1 + images.length) % images.length);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndex]);

  const touchX = useRef<number | null>(null);

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={img.caption}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex flex-col bg-forest-deep/96 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
      onTouchStart={e => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-cream md:px-8">
        <p className="text-sm">
          <span className="text-gold">{index + 1}</span> / {images.length} ·{" "}
          {img.caption}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="grid size-11 place-items-center rounded-full hover:bg-cream/10"
        >
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 md:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <m.img
            key={img.id}
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "max-h-full max-w-full rounded-xl object-contain",
              img.plan && "bg-white p-2",
            )}
          />
        </AnimatePresence>
        <button
          type="button"
          onClick={prev}
          aria-label="Gambar sebelumnya"
          className="absolute left-2 grid size-12 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 md:left-6"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Gambar berikutnya"
          className="absolute right-2 grid size-12 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 md:right-6"
        >
          <ChevronRight className="size-6" aria-hidden="true" />
        </button>
      </div>
    </m.div>
  );
}
