import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { MountainMark } from "./ui";

const NAV = [
  { id: "nuansa", label: "Nuansa" },
  { id: "fasilitas", label: "Fasilitas" },
  { id: "denah", label: "Denah & Siteplan" },
  { id: "spesifikasi", label: "Spesifikasi" },
  { id: "faq", label: "FAQ" },
];

export function Header() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  useMotionValueEvent(scrollY, "change", y => setCondensed(y > 40));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-500",
        condensed
          ? "bg-forest-deep/92 py-2 shadow-[0_8px_30px_-12px_oklch(0_0_0/0.5)] backdrop-blur-md"
          : "bg-transparent py-4 md:py-6",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 md:gap-6 md:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-cream"
          aria-label={`${site.name} — kembali ke atas`}
        >
          <MountainMark className="h-4 shrink-0 text-gold md:h-6" />
          <span className="font-heading text-lg whitespace-nowrap font-semibold tracking-tight sm:text-xl md:text-2xl">
            {site.name}
          </span>
        </a>
        <nav aria-label="Navigasi utama" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7 text-sm text-cream/85">
            {NAV.map(n => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="transition-colors hover:text-gold"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#daftar"
          className={cn(
            "ml-auto inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full border border-gold/70 px-4 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-forest-deep lg:ml-0",
          )}
        >
          Info Harga
        </a>
      </div>
    </header>
  );
}
