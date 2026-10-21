import { Eyebrow, Reveal, StaggerText } from "./ui";

const specs: [string, string][] = [
  ["Pondasi", "Telapak & batu kali"],
  ["Struktur", "Beton bertulang"],
  ["Dinding", "Bata merah, pagar barako, full finishing"],
  ["Atap", "Rangka baja ringan, genteng flat beton"],
  ["Plafon", "Gypsum"],
  ["Keramik", "40×40 ruang utama, 30×30 teras"],
  ["Kusen", "Aluminium"],
  ["Pintu", "Panel (pintu utama), double multi"],
  ["Listrik", "1300 VA"],
];

export function Specs() {
  return (
    <section
      id="spesifikasi"
      aria-labelledby="spek-title"
      className="relative overflow-hidden bg-forest text-cream"
    >
      <div aria-hidden="true" className="grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <Eyebrow tone="light">Spesifikasi bangunan</Eyebrow>
            <h2
              id="spek-title"
              className="font-heading mt-4 text-[2.5rem] leading-[0.98] font-semibold md:text-6xl"
            >
              <StaggerText text="Kokoh di dalam," />{" "}
              <StaggerText
                text="cantik di luar."
                className="text-gold-gradient italic"
                delay={0.15}
              />
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-cream/75">
              Material standar yang jelas sejak awal, sehingga Anda tahu persis
              apa yang Anda dapatkan.
            </p>
          </div>
        </div>
        <dl className="md:col-span-7">
          {specs.map(([k, v], i) => (
            <Reveal
              key={k}
              delay={i * 0.04}
              y={16}
              className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-cream/12 py-5 first:border-t md:grid-cols-[11rem_1fr] md:py-6"
            >
              <dt className="flex items-baseline gap-3 text-sm text-gold">
                <span className="font-heading text-lg text-gold/50 lining-nums tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {k}
              </dt>
              <dd className="font-heading text-xl font-medium md:text-2xl">
                {v}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
