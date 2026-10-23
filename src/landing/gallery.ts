export interface GalleryImage {
  id: string;
  src: string;
  srcSet?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** plans get a light backdrop in the lightbox */
  plan?: boolean;
}

export const gallery: GalleryImage[] = [
  {
    id: "render",
    src: "/img/hero-1171.webp",
    alt: "Ilustrasi 3D fasad deretan rumah Villa Puncak Annisa",
    caption: "Ilustrasi fasad rumah",
    width: 1171,
    height: 820,
  },
  {
    id: "aerial",
    src: "/img/aerial-1170.webp",
    alt: "Foto udara kawasan perumahan dikelilingi perbukitan hijau",
    caption: "Foto udara kawasan & perbukitan sekitar",
    width: 1170,
    height: 856,
  },
  {
    id: "siteplan",
    src: "/img/siteplan-1600.webp",
    alt: "Siteplan Villa Puncak Annisa: Blok A sampai E dengan jalan utama 11 meter",
    caption: "Siteplan — Blok A–E",
    width: 1600,
    height: 1765,
    plan: true,
  },
  {
    id: "denah",
    src: "/img/denah-1200.webp",
    srcSet: "/img/denah-800.webp 800w, /img/denah-1200.webp 1200w",
    alt: "Denah rumah lantai 1 dan lantai 2 (lebar 6 m, skala 1:100)",
    caption: "Denah LT1 & LT2 (ilustrasi brosur)",
    width: 1200,
    height: 1106,
    plan: true,
  },
];

export const byId = (id: string) => gallery.find(g => g.id === id)!;
