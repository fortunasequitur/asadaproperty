import { BadgePercent, FileCheck2, Sofa, Wallet } from "lucide-react";
import { promo } from "@/config/site";
import { Counter, Reveal } from "./ui";

const icons = [BadgePercent, FileCheck2, Wallet, Sofa];

export function PromoStrip() {
  return (
    <section
      id="promo"
      aria-labelledby="promo-title"
      className="relative bg-forest-deep text-cream"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-4">
            <h2
              id="promo-title"
              className="font-heading text-3xl leading-none font-semibold md:text-[2.6rem]"
            >
              Promo <span className="text-gold-gradient italic">bulan ini</span>
            </h2>
            <p className="mt-3 text-sm text-cream/70">
              Berlaku untuk pembelian unit selama periode promo.
            </p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2 md:col-span-8">
            {promo.map((p, i) => {
              const Icon = icons[i];
              return (
                <Reveal
                  as="li"
                  key={p.title}
                  delay={i * 0.1}
                  className="flex items-center gap-4 rounded-2xl bg-cream/[0.06] p-5 md:gap-5 md:p-6"
                >
                  <Icon
                    className="size-7 shrink-0 text-gold"
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-heading text-2xl font-semibold text-gold-soft md:text-3xl">
                      {p.title === "Cashback 50jt" ? (
                        <>
                          Cashback <Counter to={50} suffix="jt" />
                        </>
                      ) : (
                        p.title
                      )}
                    </p>
                    <p className="mt-1 text-sm text-cream/70">{p.note}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
        <p className="mt-6 text-xs text-cream/65">
          *Syarat &amp; ketentuan berlaku.
        </p>
      </div>
    </section>
  );
}
