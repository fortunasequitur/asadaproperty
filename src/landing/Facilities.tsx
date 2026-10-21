import {
  Bike,
  Coffee,
  Dumbbell,
  type LucideIcon,
  PartyPopper,
  Waves,
} from "lucide-react";
import { type PointerEvent, useRef } from "react";
import { Eyebrow, Reveal, StaggerText } from "./ui";

const items: {
  icon: LucideIcon;
  icon2?: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: Waves,
    icon2: Bike,
    title: "Water Boom & Adventure ATV",
    text: "Main air dan petualangan ATV untuk akhir pekan seru bersama anak.",
  },
  {
    icon: PartyPopper,
    title: "Gedung Pernikahan",
    text: "Gedung serbaguna untuk resepsi dan acara keluarga besar.",
  },
  {
    icon: Dumbbell,
    title: "Sport Center",
    text: "Tetap aktif dan bugar tanpa perlu jauh dari rumah.",
  },
  {
    icon: Coffee,
    title: "Café & Restaurant",
    text: "Tempat santai menikmati kopi dan udara sejuk Malang.",
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative h-full overflow-hidden rounded-[24px] bg-forest p-6 text-cream transition-transform duration-300 ease-out md:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), oklch(0.78 0.11 85 / 0.18), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}

export function Facilities() {
  return (
    <section
      id="fasilitas"
      aria-labelledby="fasilitas-title"
      className="bg-cream-deep py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Eyebrow>Fasilitas kawasan</Eyebrow>
            <h2
              id="fasilitas-title"
              className="font-heading mt-4 text-[2.5rem] leading-[0.98] font-semibold text-forest-deep md:text-6xl"
            >
              <StaggerText text="Lebih dari sekadar rumah," />{" "}
              <StaggerText
                text="ruang hidup keluarga."
                className="italic text-gold-deep"
                delay={0.15}
              />
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/70 md:col-span-5 md:justify-self-end">
            Fasilitas kawasan yang membuat hari biasa terasa seperti akhir
            pekan.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16 md:gap-5">
          {items.map((f, i) => (
            <Reveal
              as="li"
              key={f.title}
              delay={i * 0.08}
              className={i % 2 === 1 ? "lg:mt-10" : ""}
            >
              <TiltCard>
                <div className="flex items-start justify-between">
                  <span className="font-heading text-5xl leading-none font-semibold text-gold/35">
                    0{i + 1}
                  </span>
                  <span className="flex gap-1.5 text-gold">
                    <f.icon
                      className="size-7"
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                    {f.icon2 && (
                      <f.icon2
                        className="size-7"
                        strokeWidth={1.3}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </div>
                <h3 className="font-heading mt-14 text-[1.7rem] leading-tight font-semibold text-cream">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  {f.text}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
