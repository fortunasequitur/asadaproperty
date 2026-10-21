import { m, useScroll, useTransform } from "framer-motion";
import { Expand, Mountain, Route, Sofa, Sparkles, Trees } from "lucide-react";
import { useRef } from "react";
import { byId, type GalleryImage } from "./gallery";
import { Eyebrow, Reveal, StaggerText } from "./ui";

const points = [
  {
    icon: Mountain,
    title: "Sejuknya Malang setiap hari",
    text: "Bangun pagi dengan udara segar dan pemandangan hijau perbukitan — suasana liburan tanpa perlu ke mana-mana.",
  },
  {
    icon: Route,
    title: "Jalan lingkungan 11 meter",
    text: "ROW jalan utama yang lega: nyaman berpapasan mobil dan memberi kesan kawasan yang tertata.",
  },
  {
    icon: Sparkles,
    title: "Fasad modern klasik",
    text: "Lis putih, jendela grid hitam dan pintu kayu — tampilan villa yang elegan dan tidak lekang waktu.",
  },
  {
    icon: Sofa,
    title: "Interior bisa request desain",
    text: "Sampaikan konsep interior impian Anda — desain interior bisa disesuaikan atas permintaan.",
  },
  {
    icon: Trees,
    title: "Fasilitas rekreasi kawasan",
    text: "Water boom & ATV adventure, sport center, gedung pernikahan hingga café & restaurant.",
  },
];

export function Nuansa({
  onOpenImage,
}: {
  onOpenImage: (img: GalleryImage) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const aerial = byId("aerial");
  const render = byId("render");

  return (
    <section
      id="nuansa"
      aria-labelledby="nuansa-title"
      className="relative overflow-hidden py-20 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:gap-10 md:px-8">
        <div ref={ref} className="relative md:col-span-7 md:-ml-8 lg:-ml-16">
          <button
            type="button"
            onClick={() => onOpenImage(aerial)}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[28px] md:aspect-[5/4]"
            aria-label="Perbesar foto udara kawasan"
          >
            <m.img
              style={{ y, scale: 1.14 }}
              src="/img/aerial-1170.webp"
              srcSet="/img/aerial-640.webp 640w, /img/aerial-1170.webp 1170w"
              sizes="(max-width: 767px) 92vw, 58vw"
              alt={aerial.alt}
              width={1170}
              height={856}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700"
            />
            <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-forest-deep/75 px-3 py-1.5 text-xs text-cream backdrop-blur-sm transition-colors group-hover:bg-gold group-hover:text-forest-deep">
              <Expand className="size-3.5" aria-hidden="true" />
              Foto udara kawasan
            </span>
          </button>
          <Reveal
            delay={0.2}
            className="absolute -bottom-10 right-4 hidden w-[44%] md:block lg:-right-10"
          >
            <button
              type="button"
              onClick={() => onOpenImage(render)}
              className="block overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_oklch(0.22_0.05_152/0.6)] ring-8 ring-cream"
              aria-label="Perbesar ilustrasi fasad rumah"
            >
              <img
                src="/img/hero-768.webp"
                alt={render.alt}
                width={768}
                height={538}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </button>
          </Reveal>
        </div>

        <div className="md:col-span-5 md:pl-6 lg:pl-10">
          <Eyebrow>Nuansa villa</Eyebrow>
          <h2
            id="nuansa-title"
            className="font-heading mt-4 text-[2.5rem] leading-[0.98] font-semibold text-forest-deep md:text-6xl"
          >
            <StaggerText text="Pulang ke rumah," />{" "}
            <StaggerText
              text="rasanya seperti liburan."
              className="text-gold-deep italic"
              delay={0.2}
            />
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/75 md:text-base">
            Villa Puncak Annisa menghadirkan rumah tapak bergaya resort di
            kawasan Kota Malang: halaman depan yang asri, fasad elegan, dan
            lingkungan yang dikelilingi hijaunya perbukitan.
          </p>
          <ul className="mt-10 space-y-7">
            {points.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={i * 0.08}
                className="flex gap-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-gold">
                  <p.icon
                    className="size-5"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold text-forest-deep">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    {p.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
