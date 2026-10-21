import { Plus } from "lucide-react";
import { Eyebrow, Reveal } from "./ui";

const faqs = [
  {
    q: "Apakah bisa dibeli dengan KPR?",
    a: "Bisa. Pembelian dapat menggunakan KPR melalui BRI, BSI maupun BSN. Tim marketing akan membantu simulasi cicilan dan menyiapkan berkas pengajuan.",
  },
  {
    q: "Berapa uang muka (DP) yang dibutuhkan?",
    a: "Besaran DP menyesuaikan skema pembayaran yang Anda pilih (KPR, cash bertahap atau cash keras) dan promo yang sedang berjalan. Isi form untuk mendapatkan rincian terbaru.",
  },
  {
    q: "Apa saja syarat pengajuan KPR?",
    a: "Umumnya meliputi KTP, Kartu Keluarga, NPWP, slip gaji atau laporan usaha, dan rekening koran. Persyaratan akhir mengikuti ketentuan masing-masing bank.",
  },
  {
    q: "Bagaimana cara survey lokasi?",
    a: "Centang “Jadwalkan survey lokasi” pada form atau hubungi marketing via WhatsApp. Kami akan mengatur waktu kunjungan yang nyaman untuk Anda dan keluarga.",
  },
  {
    q: "Apa maksud Type 40/66?",
    a: "Angka pertama adalah luas bangunan (40 m²) dan angka kedua luas tanah (66 m²). Tersedia juga Type 75 dua lantai di Blok A & D.",
  },
  {
    q: "Promo berlaku sampai kapan?",
    a: "Promo Free PPN, Free Biaya KPR & Balik Nama, dan Cashback 50jt berlaku selama periode promo dan dengan syarat & ketentuan. Hubungi marketing untuk memastikan ketersediaan promo.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <h2
            id="faq-title"
            className="font-heading mt-4 text-[2.5rem] leading-[0.98] font-semibold text-forest-deep md:text-6xl"
          >
            Pertanyaan yang sering{" "}
            <span className="italic text-gold-deep">diajukan.</span>
          </h2>
        </div>
        <div className="md:col-span-8">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04} y={12}>
              <details className="group border-b border-forest/15 first:border-t">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="font-heading text-xl font-semibold text-forest-deep md:text-2xl">
                    {f.q}
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-deep text-forest transition-transform duration-300 group-open:rotate-45 group-open:bg-forest group-open:text-gold">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink/70">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
