import { AnimatePresence, m } from "framer-motion";
import { Expand, Minus, Plus, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState, type WheelEvent } from "react";
import { site, type UnitTypeId } from "@/config/site";
import { cn } from "@/lib/utils";
import { byId, type GalleryImage } from "./gallery";
import { Counter, Eyebrow, Reveal, StaggerText, scrollToId } from "./ui";

export function pickType(type: UnitTypeId) {
  window.dispatchEvent(new CustomEvent("vpa:pick-type", { detail: type }));
  scrollToId("daftar");
}

const types = [
  {
    id: "type40" as const,
    name: "Type 40/66",
    sub: "Rumah 1 lantai · Blok A, B, C, D, E",
    facts: [
      ["Luas bangunan", "40 m²"],
      ["Luas tanah", "66 m²"],
      ["Listrik", "1300 VA"],
    ],
    badge: "Diskon 50jt",
  },
  {
    id: "type75" as const,
    name: "Type 75",
    sub: "Rumah 2 lantai · Blok A & D",
    facts: [
      ["Luas bangunan", "75 m²"],
      ["Lantai", "2 lantai"],
      ["Listrik", "1300 VA"],
    ],
    badge: null,
  },
];

const legend = [
  {
    label: "Blok A & D",
    note: "Type 75 · 2 lantai",
    swatch: "bg-[oklch(0.58_0.21_27)]",
  },
  { label: "Blok A", note: "Type 40", swatch: "bg-[oklch(0.74_0.16_60)]" },
  { label: "Blok B", note: "Type 40", swatch: "bg-[oklch(0.84_0.06_200)]" },
  { label: "Blok C", note: "Type 40", swatch: "bg-[oklch(0.7_0.13_145)]" },
  { label: "Blok D", note: "Type 40", swatch: "bg-[oklch(0.93_0.09_105)]" },
  { label: "Blok E", note: "Type 40", swatch: "bg-[oklch(0.65_0.08_285)]" },
  {
    label: "Tahap pengembangan",
    note: "Segera hadir",
    swatch: "bg-[oklch(0.78_0.08_340)]",
  },
];

function ZoomViewer({
  img,
  srcSet,
  sizes,
}: {
  img: GalleryImage;
  srcSet?: string;
  sizes?: string;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );

  const clampScale = (s: number) => Math.min(4, Math.max(1, s));
  const zoom = (d: number) => {
    setScale(s => {
      const n = clampScale(s + d);
      if (n === 1) setPos({ x: 0, y: 0 });
      return n;
    });
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (scale === 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPos({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  };
  const onUp = () => {
    drag.current = null;
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.25 : -0.25);
  };

  return (
    <div className="relative">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer pan surface; zoom buttons are the keyboard path */}
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onWheel={onWheel}
        onDoubleClick={() => {
          if (scale > 1) {
            setScale(1);
            setPos({ x: 0, y: 0 });
          } else setScale(2);
        }}
        data-lenis-prevent={scale > 1 ? "" : undefined}
        className={cn(
          "relative aspect-[1/1.06] w-full touch-pan-y overflow-hidden rounded-[22px] bg-white select-none",
          scale > 1
            ? "cursor-grab touch-none active:cursor-grabbing"
            : "cursor-zoom-in",
        )}
      >
        <img
          src={img.src}
          srcSet={srcSet}
          sizes={sizes}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain p-3 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          }}
        />
      </div>
      <div className="absolute top-3 right-3 flex gap-1.5 rounded-full bg-forest-deep/85 p-1 text-cream backdrop-blur-sm">
        <button
          type="button"
          onClick={() => zoom(-0.5)}
          aria-label="Perkecil"
          className="grid size-9 place-items-center rounded-full hover:bg-cream/15 disabled:opacity-40"
          disabled={scale === 1}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => zoom(0.5)}
          aria-label="Perbesar"
          className="grid size-9 place-items-center rounded-full hover:bg-cream/15 disabled:opacity-40"
          disabled={scale === 4}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            setScale(1);
            setPos({ x: 0, y: 0 });
          }}
          aria-label="Reset tampilan"
          className="grid size-9 place-items-center rounded-full hover:bg-cream/15"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function PlanSection({
  onOpenImage,
}: {
  onOpenImage: (img: GalleryImage) => void;
}) {
  const [tab, setTab] = useState<"siteplan" | "denah">("siteplan");
  const current = byId(tab);

  return (
    <section
      id="denah"
      aria-labelledby="denah-title"
      className="py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <Eyebrow>Tipe, denah &amp; siteplan</Eyebrow>
          <h2
            id="denah-title"
            className="font-heading mt-4 text-[2.5rem] leading-[0.98] font-semibold text-forest-deep md:text-6xl"
          >
            <StaggerText text="Pilih rumah yang" />{" "}
            <StaggerText
              text="pas untuk keluarga."
              className="italic text-gold-deep"
              delay={0.15}
            />
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* unit types */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {types.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <article className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_20px_50px_-30px_oklch(0.22_0.05_152/0.45)] md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-4xl font-semibold text-forest-deep">
                        {t.name}
                      </h3>
                      <p className="mt-1 text-sm text-ink/65">{t.sub}</p>
                    </div>
                    {t.badge && (
                      <span className="shrink-0 rounded-full bg-gold-sheen px-3 py-1 text-xs font-bold text-forest-deep">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-forest/10 pt-5">
                    {t.facts.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-ink/65">{k}</dt>
                        <dd className="mt-0.5 font-semibold text-forest-deep">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-ink/70">
                      {site.priceFrom ? (
                        <>
                          Mulai{" "}
                          <strong className="text-forest-deep">
                            {site.priceFrom}
                          </strong>
                        </>
                      ) : (
                        "Harga & simulasi KPR via form"
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => pickType(t.id)}
                      className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
                    >
                      Tanya harga {t.name}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal
              delay={0.2}
              className="rounded-[24px] bg-forest-deep p-6 text-cream md:p-8"
            >
              <h3 className="font-heading text-2xl font-semibold text-gold-soft">
                Legenda siteplan
              </h3>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                {legend.map(l => (
                  <li key={l.label} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "size-3.5 shrink-0 rounded-[4px]",
                        l.swatch,
                      )}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="font-semibold">{l.label}</span>{" "}
                      <span className="text-cream/65">· {l.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-cream/15 pt-4 text-xs leading-relaxed text-cream/65">
                Kavling A1–A30 · B1–B44 · C1–C35 · D1–D37 · E1–E55 (
                <Counter to={200} prefix="±" /> unit) · ROW jalan utama{" "}
                <Counter to={11} suffix=" m" />
              </p>
            </Reveal>
          </div>

          {/* plan viewer */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="lg:sticky lg:top-24">
              <div
                role="tablist"
                aria-label="Pilih gambar"
                className="mb-4 inline-flex rounded-full bg-cream-deep p-1"
              >
                {(["siteplan", "denah"] as const).map(k => (
                  <button
                    key={k}
                    role="tab"
                    type="button"
                    aria-selected={tab === k}
                    aria-controls="plan-panel"
                    onClick={() => setTab(k)}
                    className={cn(
                      "relative min-h-10 rounded-full px-5 text-sm font-semibold transition-colors",
                      tab === k
                        ? "text-cream"
                        : "text-forest hover:text-forest-deep",
                    )}
                  >
                    {tab === k && (
                      <m.span
                        layoutId="plan-tab"
                        className="absolute inset-0 rounded-full bg-forest"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}
                    <span className="relative">
                      {k === "siteplan" ? "Siteplan" : "Denah LT1 & LT2"}
                    </span>
                  </button>
                ))}
              </div>
              <div id="plan-panel" role="tabpanel" className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    {tab === "siteplan" ? (
                      <ZoomViewer
                        img={current}
                        srcSet="/img/siteplan-800.webp 800w, /img/siteplan-1600.webp 1600w"
                        sizes="(max-width: 1023px) 92vw, 52vw"
                      />
                    ) : (
                      <ZoomViewer img={current} />
                    )}
                  </m.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink/70">
                <p>
                  {tab === "siteplan"
                    ? "Ketuk + untuk memperbesar, lalu geser untuk menjelajah blok."
                    : "Denah ilustrasi dari brosur; dapat berubah sesuai gambar kerja."}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenImage(current)}
                  className="inline-flex items-center gap-1.5 font-semibold text-forest hover:text-gold-deep"
                >
                  <Expand className="size-3.5" aria-hidden="true" />
                  Layar penuh
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
