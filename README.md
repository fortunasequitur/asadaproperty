# Villa Puncak Annisa — Landing Page

Landing page promosi properti **Villa Puncak Annisa** (Kota Malang, Type 40/66 & Type 75) dengan form lead untuk calon customer dari iklan, plus dashboard admin untuk kelola lead.

**Live:** https://villa-puncak-annisa-devtool-2.viktor.space · Admin: `/admin`

## Stack

- React 19 + Vite + TypeScript + Tailwind CSS
- Framer Motion (animasi & smooth scroll)
- Convex (database + backend untuk lead form & admin)

## Fitur

- Hero, promo, nuansa, fasilitas, denah & siteplan, spesifikasi, KPR (BRI, BSI, BSN), lokasi, FAQ
- Form lead: simpan nama, WhatsApp, tipe, + UTM / fbclid / gclid dari iklan; honeypot, rate limit, dedupe 24 jam
- Halaman terima kasih + tombol chat WhatsApp marketing
- Tombol WhatsApp sticky (mobile) & floating (desktop)
- `/admin`: daftar lead, status, filter, chat WA, export CSV (login wajib)

## Konfigurasi

Semua isi yang sering diganti (nomor WA, promo, harga, alamat, Google Maps, bank KPR, Meta Pixel / Google tag ID) ada di **`src/config/site.ts`**.

## Jalankan lokal

```bash
bun install
cp .env.example .env.local   # isi VITE_CONVEX_URL dari deployment Convex lo
bunx convex dev              # backend
bun run dev                  # frontend
```

Build production: `bun run build` (output ke `dist/`).

> Catatan: project ini dibuat sebagai Viktor Space. Login admin ("Sign in with Viktor") dan akses edge memakai platform Viktor; kalau di-host di tempat lain, bagian auth di `convex/auth.ts` & `src/admin/` perlu disesuaikan. Detail template ada di `README.viktor-template.md`.
