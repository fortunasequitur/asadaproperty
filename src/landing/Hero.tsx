import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { kprBanksLabel, site } from "@/config/site";
import { Counter, GoldButton, MountainMark, scrollToId } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[max(100svh,640px)] flex-col overflow-hidden bg-forest-deep text-cream md:max-h-[980px] md:min-h-[max(100svh,760px)]"
    >
      <m.div
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ y: imgY, scale: imgScale }}
      >
        <picture className="block h-full w-full">
          <source
            media="(max-width: 767px)"
            srcSet="/img/hero-m-420.webp 420w, /img/hero-m-600.webp 600w"
            sizes="100vw"
            width={600}
            height={820}
          />
          <img
            src="/img/hero-1171.webp"
            srcSet="/img/hero-768.webp 768w, /img/hero-1171.webp 1171w"
            sizes="100vw"
            alt="Ilustrasi 3D deretan rumah Villa Puncak Annisa dengan fasad putih, atap genteng gelap, dan pohon palem"
            width={1171}
            height={820}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center md:object-[58%_center]"
          />
        </picture>
      </m.div>
      {/* legibility: forest wash from the left and the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,oklch(0.22_0.05_152/0.55)_0%,oklch(0.22_0.05_152/0)_22%,oklch(0.22_0.05_152/0.55)_45%,oklch(0.22_0.05_152/0.92)_66%,oklch(0.22_0.05_152/0.98)_100%)] md:bg-[linear-gradient(90deg,oklch(0.22_0.05_152/0.92)_0%,oklch(0.22_0.05_152/0.6)_42%,oklch(0.22_0.05_152/0)_70%),linear-gradient(180deg,oklch(0.22_0.05_152/0.5)_0%,transparent_25%,transparent_70%,oklch(0.22_0.05_152/0.85)_100%)]"
      />

      {/* "Diskon 50jt" seal, after the flyer */}
      <m.div
        initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: -8 }}
        transition={{ duration: 1, delay: 0.7, ease }}
        className="absolute top-24 right-5 grid size-24 place-items-center rounded-full bg-gold-sheen text-center text-forest-deep shadow-[0_12px_40px_-8px_oklch(0_0_0/0.55)] md:top-32 md:right-[8%] md:size-36"
      >
        <div className="absolute inset-1.5 rounded-full border border-dashed border-forest-deep/35" />
        <p className="leading-none">
          <span className="block text-[11px] font-semibold md:text-sm">
            Diskon
          </span>
          <span className="font-heading block text-3xl font-bold md:text-5xl">
            50jt
          </span>
        </p>
      </m.div>

      <m.div
        style={{ y: contentY }}
        className="mx-auto mt-auto flex w-full max-w-7xl flex-col px-5 pb-8 md:my-auto md:px-8 md:pt-28 md:pb-0"
      >
        <m.div
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="flex flex-wrap items-center gap-2 text-[13px] font-medium md:text-sm"
        >
          <span className="rounded-full bg-cream/12 px-3 py-1 text-cream backdrop-blur-sm">
            {site.city}
          </span>
          <span className="rounded-full bg-cream/12 px-3 py-1 text-cream backdrop-blur-sm">
            Type 40/66 &amp; Type 75
          </span>
          <span className="rounded-full bg-cream/12 px-3 py-1 text-cream backdrop-blur-sm">
            {site.priceFrom
              ? `Mulai ${site.priceFrom}`
              : `Bisa KPR ${kprBanksLabel}`}
          </span>
        </m.div>

        <h1 className="font-heading mt-5 max-w-[13ch] text-[2.85rem] leading-[0.95] font-semibold tracking-[-0.01em] text-balance md:mt-7 md:text-[5.6rem] md:leading-[0.9]">
          {["Rumah", "mewah"].map((w, i) => (
            <span
              key={w}
              className="inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <m.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.15 + i * 0.08, ease }}
              >
                {w}&nbsp;
              </m.span>
            </span>
          ))}
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <m.span
              className="text-gold-gradient inline-block italic"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.32, ease }}
            >
              nuansa villa
            </m.span>
          </span>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <m.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.42, ease }}
            >
              di Kota Malang.
            </m.span>
          </span>
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/85 md:mt-7 md:text-lg">
          Hunian bergaya resort dengan udara sejuk khas Malang, jalan lingkungan
          selebar 11 meter, plus promo{" "}
          <strong className="font-semibold text-gold-soft">
            Free PPN, Free Biaya KPR &amp; Balik Nama, Cashback 50jt
          </strong>
          .
        </p>

        <m.div
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-9"
        >
          <GoldButton
            onClick={() => scrollToId("daftar")}
            className="w-full sm:w-auto"
          >
            Dapatkan Info Harga &amp; Promo
          </GoldButton>
          <button
            type="button"
            onClick={() => scrollToId("denah")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium text-cream/90 transition-colors hover:text-gold"
          >
            Lihat denah &amp; siteplan
            <ArrowDown className="size-4" aria-hidden="true" />
          </button>
        </m.div>
      </m.div>

      {/* stat rail */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative mx-auto w-full max-w-7xl px-5 pb-6 md:px-8 md:pb-10"
      >
        <div className="flex items-center gap-3 border-t border-cream/15 pt-5 md:pt-6">
          <MountainMark className="hidden h-4 shrink-0 text-gold md:block" />
          <dl className="grid w-full grid-cols-3 gap-4 md:max-w-2xl md:gap-10">
            <div>
              <dt className="text-[11px] text-cream/65 md:text-xs">Cashback</dt>
              <dd className="font-heading text-2xl font-semibold text-gold md:text-4xl">
                <Counter staticWhenShell to={50} suffix="jt" />
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-cream/65 md:text-xs">
                ROW jalan
              </dt>
              <dd className="font-heading text-2xl font-semibold text-gold md:text-4xl">
                <Counter staticWhenShell to={11} suffix="m" />
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-cream/65 md:text-xs">Kavling</dt>
              <dd className="font-heading text-2xl font-semibold text-gold md:text-4xl">
                <Counter staticWhenShell to={200} prefix="±" />
              </dd>
            </div>
          </dl>
        </div>
      </m.div>
    </section>
  );
}
