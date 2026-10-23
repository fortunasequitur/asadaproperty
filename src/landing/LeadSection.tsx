import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { AnimatePresence, m } from "framer-motion";
import {
  CalendarCheck,
  Check,
  FileText,
  Gift,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import {
  type PaymentPlanId,
  paymentPlans,
  site,
  type UnitTypeId,
  unitTypes,
  whatsappLink,
} from "@/config/site";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import {
  cleanName,
  normalizeIndoPhone,
  validateName,
} from "../../convex/leadRules";
import { sendLeadToSheet } from "./sheets";
import { getAttribution, getClientId, trackLead } from "./tracking";
import { Eyebrow, GoldButton, MountainMark, WhatsAppIcon } from "./ui";

type Errors = Partial<
  Record<"name" | "phone" | "paymentPlan" | "unitType" | "form", string>
>;

const inputCls =
  "block w-full min-h-12 rounded-xl border border-forest/15 bg-white px-4 text-[16px] text-ink placeholder:text-ink/40 transition-[border-color,box-shadow] focus:border-gold-deep focus:outline-none focus:ring-4 focus:ring-gold/25 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15";

function Choice<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  error?: string;
}) {
  const errId = `${name}-err`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="mb-2 text-sm font-semibold text-forest-deep">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <label
            key={o.id}
            className={cn(
              "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-gold/30",
              value === o.id
                ? "border-forest bg-forest text-cream"
                : "border-forest/20 bg-white text-forest hover:border-forest/50",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              className="sr-only"
            />
            {value === o.id && (
              <Check className="size-4 text-gold" aria-hidden="true" />
            )}
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errId} className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** canvas-confetti only takes hex; resolve the palette tokens at runtime. */
function cssVarToHex(name: string): string {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return "gold";
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

function ThankYou({ name, unitLabel }: { name: string; unitLabel: string }) {
  const msg = `Halo, saya ${name}. Saya baru mengisi form di website ${site.name} dan tertarik dengan ${unitLabel}. Mohon info harga, promo & jadwal survey.`;
  const wa = whatsappLink(msg);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 28,
        gravity: 0.9,
        ticks: 160,
        scalar: 0.8,
        origin: { y: 0.6 },
        colors: ["--gold", "--gold-soft", "--forest-soft", "--cream"].map(
          cssVarToHex,
        ),
        disableForReducedMotion: true,
      });
    });
  }, []);
  return (
    <m.div
      key="thanks"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center py-6 text-center"
      data-testid="thank-you"
    >
      <span className="grid size-16 place-items-center rounded-full bg-gold-sheen text-forest-deep">
        <Check className="size-8" strokeWidth={2.4} aria-hidden="true" />
      </span>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-heading mt-6 text-4xl font-semibold text-forest-deep outline-none"
      >
        Terima kasih, {name.split(" ")[0]}!
      </h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink/70">
        Data Anda sudah kami terima. Tim marketing akan segera menghubungi Anda
        via WhatsApp dengan info harga &amp; promo {unitLabel}.
      </p>
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-wa px-7 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon />
          Chat Marketing via WhatsApp
        </a>
      ) : (
        <p className="mt-7 rounded-xl bg-cream-deep px-4 py-3 text-sm text-ink/70">
          Tim kami akan menghubungi Anda melalui nomor yang Anda daftarkan.
        </p>
      )}
    </m.div>
  );
}

export function LeadForm() {
  const submit = useMutation(api.leads.submit);
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [plan, setPlan] = useState<PaymentPlanId | null>(null);
  const [unit, setUnit] = useState<UnitTypeId | null>(null);
  const [survey, setSurvey] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ name: string; unitLabel: string } | null>(
    null,
  );

  useEffect(() => {
    const onPick = (e: Event) => {
      const t = (e as CustomEvent<UnitTypeId>).detail;
      if (t) setUnit(t);
    };
    window.addEventListener("vpa:pick-type", onPick);
    return () => window.removeEventListener("vpa:pick-type", onPick);
  }, []);

  const validate = (): Errors => {
    const e: Errors = {};
    const n = validateName(name);
    if (n) e.name = name.trim() ? n : "Mohon isi nama Anda";
    if (!phone.trim()) e.phone = "Mohon isi nomor WhatsApp";
    else if (!normalizeIndoPhone(phone))
      e.phone = "Nomor WhatsApp tidak valid (contoh: 0812 3456 7890)";
    if (!plan) e.paymentPlan = "Pilih rencana pembayaran";
    if (!unit) e.unitType = "Pilih tipe rumah";
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const a = getAttribution();
      const clientId = getClientId();
      const res = await submit({
        name,
        phone,
        city: city || undefined,
        paymentPlan: plan!,
        unitType: unit!,
        wantsSurvey: survey,
        website: website || undefined,
        ...a,
        userAgent: navigator.userAgent.slice(0, 400),
        clientId,
      });
      const unitLabel = unitTypes.find(u => u.id === unit)!.label;
      trackLead(unitLabel);
      if (!website && !res.duplicate) {
        sendLeadToSheet({
          name: cleanName(name),
          phone: normalizeIndoPhone(phone) ?? phone,
          city: city.trim(),
          paymentPlan: paymentPlans.find(p => p.id === plan)!.label,
          unitType: unitLabel,
          wantsSurvey: survey,
          utmSource: a.utmSource,
          utmMedium: a.utmMedium,
          utmCampaign: a.utmCampaign,
          utmContent: a.utmContent,
          fbclid: a.fbclid,
          gclid: a.gclid,
          landingUrl: a.landingUrl,
          clientId,
        });
      }
      setDone({ name: name.replace(/\s+/g, " ").trim(), unitLabel });
    } catch (err) {
      const msg =
        err instanceof ConvexError && typeof err.data === "string"
          ? err.data
          : "Gagal mengirim. Periksa koneksi Anda lalu coba lagi.";
      setErrors({ form: msg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-[28px] bg-cream p-6 text-ink shadow-[0_40px_80px_-40px_oklch(0_0_0/0.6)] md:p-9">
      <AnimatePresence mode="wait">
        {done ? (
          <ThankYou key="t" name={done.name} unitLabel={done.unitLabel} />
        ) : (
          <m.form
            key="f"
            exit={{ opacity: 0, y: -10 }}
            onSubmit={onSubmit}
            noValidate
            className="space-y-5"
            aria-label="Form info harga & promo"
          >
            <div>
              <h3 className="font-heading text-3xl font-semibold text-forest-deep">
                Dapatkan info harga &amp; promo
              </h3>
              <p className="mt-1 text-sm text-ink/70">
                Gratis, tanpa komitmen. Hanya 30 detik.
              </p>
            </div>

            <div>
              <label
                htmlFor={`${uid}-name`}
                className="mb-1.5 block text-sm font-semibold text-forest-deep"
              >
                Nama
              </label>
              <input
                id={`${uid}-name`}
                name="name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                placeholder="Nama lengkap"
                maxLength={80}
                className={inputCls}
              />
              {errors.name && (
                <p
                  id={`${uid}-name-err`}
                  className="mt-1.5 text-sm text-destructive"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${uid}-phone`}
                className="mb-1.5 block text-sm font-semibold text-forest-deep"
              >
                Nomor WhatsApp
              </label>
              <div className="relative">
                <WhatsAppIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-wa" />
                <input
                  id={`${uid}-phone`}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={
                    errors.phone ? `${uid}-phone-err` : undefined
                  }
                  placeholder="0812 3456 7890"
                  maxLength={20}
                  className={cn(inputCls, "pl-12")}
                />
              </div>
              {errors.phone && (
                <p
                  id={`${uid}-phone-err`}
                  className="mt-1.5 text-sm text-destructive"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${uid}-city`}
                className="mb-1.5 block text-sm font-semibold text-forest-deep"
              >
                Domisili / Kota{" "}
                <span className="font-normal text-ink/65">(opsional)</span>
              </label>
              <input
                id={`${uid}-city`}
                name="city"
                autoComplete="address-level2"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Contoh: Malang, Surabaya"
                maxLength={60}
                className={inputCls}
              />
            </div>

            <div
              id={`${uid}-paymentPlan`}
              tabIndex={-1}
              className="outline-none"
            >
              <Choice
                name="paymentPlan"
                legend="Rencana pembayaran"
                options={paymentPlans}
                value={plan}
                onChange={setPlan}
                error={errors.paymentPlan}
              />
            </div>
            <div id={`${uid}-unitType`} tabIndex={-1} className="outline-none">
              <Choice
                name="unitType"
                legend="Minat tipe"
                options={unitTypes}
                value={unit}
                onChange={setUnit}
                error={errors.unitType}
              />
            </div>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl bg-cream-deep px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={survey}
                onChange={e => setSurvey(e.target.checked)}
                className="size-5 accent-[var(--forest)]"
              />
              <span>
                <span className="font-semibold text-forest-deep">
                  Jadwalkan survey lokasi
                </span>
                <span className="block text-ink/70">
                  Kami hubungi untuk atur waktu kunjungan.
                </span>
              </span>
            </label>

            {/* honeypot */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  name="website"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </label>
            </div>

            {errors.form && (
              <p
                className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {errors.form}
              </p>
            )}

            <GoldButton type="submit" disabled={busy} className="w-full">
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />{" "}
                  Mengirim…
                </>
              ) : (
                "Kirim & Dapatkan Info Harga"
              )}
            </GoldButton>
            <p className="flex items-center justify-center gap-1.5 text-xs text-ink/65">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Data Anda aman dan hanya digunakan untuk menghubungi Anda.
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const benefits = [
  {
    icon: FileText,
    title: "Daftar harga & simulasi KPR",
    text: "Rincian harga, DP dan cicilan sesuai kemampuan Anda.",
  },
  {
    icon: Gift,
    title: "Promo terbaru",
    text: "Free PPN, Free Biaya KPR & Balik Nama, Cashback 50jt, plus interior bisa request desain.",
  },
  {
    icon: CalendarCheck,
    title: "Jadwal survey lokasi",
    text: "Lihat langsung kawasan dan rasakan sejuknya Malang.",
  },
];

export function LeadSection() {
  return (
    <section
      id="daftar"
      aria-labelledby="daftar-title"
      className="relative overflow-hidden bg-forest-deep py-20 text-cream md:py-28"
    >
      <div aria-hidden="true" className="grain absolute inset-0 opacity-50" />
      <MountainMark className="pointer-events-none absolute -right-20 bottom-10 h-56 text-gold/10 md:h-80" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:pt-6">
          <Eyebrow tone="light">Info harga &amp; promo</Eyebrow>
          <h2
            id="daftar-title"
            className="font-heading mt-4 text-[2.6rem] leading-[0.98] font-semibold md:text-6xl"
          >
            Selangkah lagi menuju{" "}
            <span className="text-gold-gradient italic">rumah villa</span> Anda.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-cream/75">
            Isi form singkat ini, tim marketing kami akan mengirimkan via
            WhatsApp:
          </p>
          <ul className="mt-8 space-y-6">
            {benefits.map(b => (
              <li key={b.title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                  <b.icon
                    className="size-5"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="font-semibold text-cream">{b.title}</p>
                  <p className="mt-0.5 text-sm text-cream/65">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
