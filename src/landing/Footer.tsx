import { defaultWaMessage, site, whatsappLink } from "@/config/site";
import { GoldButton, MountainMark, scrollToId } from "./ui";

export function Footer() {
  return (
    <footer className="bg-forest-deep pb-28 text-cream md:pb-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-start gap-8 border-b border-cream/10 py-14 md:flex-row md:items-end md:justify-between">
          <div>
            <MountainMark className="h-8 text-gold" />
            <p className="font-heading mt-3 text-4xl font-semibold md:text-5xl">
              {site.name}
            </p>
            <p className="mt-2 max-w-md text-sm text-cream/70">
              {site.tagline}
            </p>
            {site.whatsappDisplay && (
              <p className="mt-3 text-sm text-cream/80">
                WhatsApp marketing:{" "}
                <a
                  href={whatsappLink(defaultWaMessage) ?? "#daftar"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold hover:text-gold-soft"
                >
                  {site.whatsappDisplay}
                </a>
              </p>
            )}
          </div>
          <GoldButton onClick={() => scrollToId("daftar")}>
            Dapatkan Info Harga &amp; Promo
          </GoldButton>
        </div>
        <div className="flex flex-col gap-4 py-8 text-xs text-cream/65 md:flex-row md:justify-between">
          <p className="max-w-2xl leading-relaxed">
            *Syarat &amp; ketentuan berlaku. Gambar, denah dan siteplan bersifat
            ilustrasi dan dapat berubah sewaktu-waktu tanpa pemberitahuan. Harga
            dan promo mengikuti ketentuan developer pada saat transaksi.
          </p>
          <p className="shrink-0">
            © {new Date().getFullYear()} {site.developerName || site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
