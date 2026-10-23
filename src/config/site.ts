/**
 * ─────────────────────────────────────────────────────────────────────────
 *  KONFIGURASI SITUS — satu-satunya file yang perlu diisi pemilik.
 *  Semua nilai bertanda `TODO` masih placeholder. Kosongkan ("") berarti
 *  fitur terkait otomatis disembunyikan / dialihkan ke form.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const site: Record<
  | "name"
  | "siteUrl"
  | "convexUrlFallback"
  | "tagline"
  | "city"
  | "developerName"
  | "whatsappNumber"
  | "whatsappDisplay"
  | "phoneDisplay"
  | "marketingOfficeAddress"
  | "googleMapsUrl"
  | "googleMapsEmbedUrl"
  | "priceFrom"
  | "metaPixelId"
  | "googleTagId"
  | "googleAdsLeadSendTo",
  string
> = {
  name: "Villa Puncak Annisa",
  /**
   * URL produksi tanpa "/" di akhir. Dipakai saat build untuk og:image,
   * og:url, canonical & JSON-LD di index.html (token __SITE_URL__).
   */
  siteUrl: "https://asadaproperty.com",
  /**
   * Backend Convex produksi. Dipakai otomatis kalau env VITE_CONVEX_URL
   * tidak di-set saat build (mis. hosting di Vercel). URL publik, bukan rahasia.
   */
  convexUrlFallback: "https://cheery-lark-913.convex.cloud",
  tagline: "Rumah Mewah Nuansa Villa di Kawasan Kota Malang",
  city: "Kota Malang",

  /** TODO: nama developer / PT pemasaran. Kosong = tidak ditampilkan. */
  developerName: "",

  /**
   * TODO: nomor WhatsApp marketing, format internasional tanpa "+" / spasi,
   * contoh "6281xxxxxxxxx". Kosong = tombol WhatsApp mengarah ke form.
   */
  whatsappNumber: "6285647457015",

  /** TODO: nomor telepon kantor untuk ditampilkan, contoh "0341 xxx xxx". */
  phoneDisplay: "",

  /** Nomor WhatsApp untuk ditampilkan. */
  whatsappDisplay: "0856-4745-7015",

  /** TODO: alamat kantor pemasaran (Kota Malang). */
  marketingOfficeAddress: "",

  /** TODO: link Google Maps lokasi proyek (https://maps.app.goo.gl/…). */
  googleMapsUrl: "",

  /**
   * TODO: URL embed Google Maps (Bagikan → Sematkan peta → ambil nilai src
   * dari iframe, https://www.google.com/maps/embed?pb=…).
   */
  googleMapsEmbedUrl: "",

  /** TODO: harga mulai, contoh "Rp 4xx jutaan". Kosong = "Harga via form". */
  priceFrom: "",

  /** Meta (Facebook) Pixel ID — ASADA PROPERTY. */
  metaPixelId: "2009831413032140",

  /** TODO: Google tag ID (GA4 "G-XXXX" atau Google Ads "AW-XXXX"). */
  googleTagId: "",

  /**
   * TODO: label konversi Google Ads untuk event Lead, format
   * "AW-XXXXXXXXX/abcDEFghiJKL". Kosong = hanya event generate_lead.
   */
  googleAdsLeadSendTo: "",
};

export const promo = [
  { title: "Free PPN", note: "Bebas Pajak Pertambahan Nilai" },
  {
    title: "Free Biaya KPR & Balik Nama",
    note: "Biaya KPR dan balik nama ditanggung",
  },
  { title: "Cashback 50jt", note: "Potongan langsung Rp 50 juta" },
  {
    title: "Interior bisa request",
    note: "Desain interior sesuai keinginan Anda",
  },
] as const;

export const unitTypes = [
  { id: "type40", label: "Type 40/66", note: "1 lantai" },
  { id: "type75", label: "Type 75 2 Lantai", note: "Blok A & D" },
] as const;

export type UnitTypeId = (typeof unitTypes)[number]["id"];

export const paymentPlans = [
  { id: "kpr", label: "KPR" },
  { id: "cash_bertahap", label: "Cash Bertahap" },
  { id: "cash_keras", label: "Cash Keras" },
] as const;

export type PaymentPlanId = (typeof paymentPlans)[number]["id"];

export function whatsappLink(message: string): string | null {
  const n = site.whatsappNumber.replace(/\D/g, "");
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export const defaultWaMessage = `Halo, saya tertarik dengan ${site.name} di ${site.city}. Boleh minta info harga & promo terbaru?`;

/**
 * Bank partner KPR. `logo` = file di /public/logos (logo resmi). Tanpa logo
 * ditampilkan sebagai badge teks.
 */
export const kprBanks: {
  name: string;
  fullName: string;
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  /** Stacked logos need more height to match the wordmarks optically. */
  tall?: boolean;
}[] = [
  {
    name: "BRI",
    fullName: "Bank Rakyat Indonesia",
    logo: "/logos/bri.svg",
    logoWidth: 512,
    logoHeight: 192,
  },
  {
    name: "BSI",
    fullName: "Bank Syariah Indonesia",
    logo: "/logos/bsi.svg",
    logoWidth: 512,
    logoHeight: 142,
  },
  {
    name: "BSN",
    fullName: "Bank Syariah Nasional",
    logo: "/logos/bsn.png",
    logoWidth: 259,
    logoHeight: 200,
    tall: true,
  },
];

export const kprBanksLabel = "BRI, BSI & BSN";
