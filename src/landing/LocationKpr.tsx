import { MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { defaultWaMessage, kprBanks, site, whatsappLink } from "@/config/site";
import { Eyebrow, Reveal, StaggerText, scrollToId } from "./ui";

export function Kpr() {
  return (
    <section id="kpr" aria-labelledby="kpr-title" className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="grid items-center gap-8 rounded-[28px] bg-white p-7 shadow-[0_24px_60px_-36px_oklch(0.22_0.05_152/0.5)] md:grid-cols-12 md:p-12">
          <div className="md:col-span-6">
            <Eyebrow>Pembiayaan</Eyebrow>
            <h2
              id="kpr-title"
              className="font-heading mt-3 text-4xl leading-none font-semibold text-forest-deep md:text-5xl"
            >
              Bisa KPR, cicilan lebih ringan.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
              Bekerja sama dengan BRI, BSI dan BSN. Tim marketing kami bantu
              simulasi cicilan dan pengajuan KPR dari awal sampai akad.
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-3 md:col-span-6 md:gap-4">
            {kprBanks.map(b => (
              <li
                key={b.name}
                className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl bg-cream p-4 text-center md:min-h-36 md:p-6"
              >
                <span className="flex h-12 items-center justify-center md:h-16">
                  {b.logo ? (
                    <img
                      src={b.logo}
                      alt={`Logo ${b.fullName} (${b.name})`}
                      width={b.logoWidth}
                      height={b.logoHeight}
                      loading="lazy"
                      decoding="async"
                      className={
                        b.tall
                          ? "h-12 w-auto max-w-full object-contain md:h-16"
                          : "h-8 w-auto max-w-full object-contain md:h-11"
                      }
                    />
                  ) : (
                    <span
                      className="font-heading grid h-8 place-items-center rounded-lg bg-forest px-3 text-xl font-bold tracking-wide text-gold-soft md:h-11 md:px-4 md:text-2xl"
                      title={b.fullName}
                    >
                      {b.name}
                    </span>
                  )}
                </span>
                <span className="text-xs text-ink/70">KPR {b.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function MapEmbed() {
  const [load, setLoad] = useState(false);
  if (!site.googleMapsEmbedUrl) return null;
  return load ? (
    <iframe
      title={`Peta lokasi ${site.name}`}
      src={site.googleMapsEmbedUrl}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-full min-h-80 w-full rounded-[24px] border-0"
    />
  ) : (
    <button
      type="button"
      onClick={() => setLoad(true)}
      className="grid h-full min-h-80 w-full place-items-center rounded-[24px] bg-forest text-cream"
    >
      <span className="inline-flex items-center gap-2 font-semibold">
        <MapPin className="size-5 text-gold" aria-hidden="true" /> Tampilkan
        peta
      </span>
    </button>
  );
}

export function Location() {
  const hasMap = Boolean(site.googleMapsEmbedUrl);
  return (
    <section
      id="lokasi"
      aria-labelledby="lokasi-title"
      className="pb-20 md:pb-28"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Eyebrow>Lokasi</Eyebrow>
          <h2
            id="lokasi-title"
            className="font-heading mt-4 text-[2.5rem] leading-[0.98] font-semibold text-forest-deep md:text-6xl"
          >
            <StaggerText text="Di kawasan" />{" "}
            <StaggerText
              text="Kota Malang."
              className="italic text-gold-deep"
              delay={0.12}
            />
          </h2>
          <ul className="mt-8 space-y-4 text-[15px] text-ink/80">
            <li className="flex gap-3">
              <MapPin
                className="mt-0.5 size-5 shrink-0 text-gold-deep"
                aria-hidden="true"
              />
              <span>
                {site.marketingOfficeAddress ||
                  "Alamat lengkap & titik lokasi dikirim tim marketing setelah Anda mengisi form."}
              </span>
            </li>
            {site.whatsappDisplay && (
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-gold-deep"
                  aria-hidden="true"
                />
                <a
                  href={whatsappLink(defaultWaMessage) ?? "#daftar"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-forest"
                >
                  WhatsApp marketing:{" "}
                  <strong className="font-semibold">
                    {site.whatsappDisplay}
                  </strong>
                </a>
              </li>
            )}
            {site.phoneDisplay && (
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-gold-deep"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${site.phoneDisplay.replace(/[^\d+]/g, "")}`}
                  className="hover:text-forest"
                >
                  {site.phoneDisplay}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {site.googleMapsUrl && (
              <a
                href={site.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/25 px-5 text-sm font-semibold text-forest hover:bg-forest hover:text-cream"
              >
                <Navigation className="size-4" aria-hidden="true" /> Buka Google
                Maps
              </a>
            )}
            <button
              type="button"
              onClick={() => scrollToId("daftar")}
              className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-cream hover:bg-forest-deep"
            >
              Jadwalkan survey lokasi
            </button>
          </div>
        </div>
        <Reveal className="md:col-span-7" delay={0.1}>
          {hasMap ? (
            <MapEmbed />
          ) : (
            <div className="relative h-full min-h-72 overflow-hidden rounded-[24px]">
              <img
                src="/img/aerial-1170.webp"
                srcSet="/img/aerial-640.webp 640w, /img/aerial-1170.webp 1170w"
                sizes="(max-width: 767px) 92vw, 58vw"
                alt="Pemandangan perbukitan hijau di sekitar kawasan"
                width={1170}
                height={856}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,oklch(0.22_0.05_152/0.9))]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream md:p-8">
                <p className="font-heading text-3xl font-semibold">
                  Kota Malang, Jawa Timur
                </p>
                <p className="mt-1 max-w-md text-sm text-cream/80">
                  Kawasan hijau berhawa sejuk. Survey lokasi bisa dijadwalkan
                  bersama tim marketing.
                </p>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
