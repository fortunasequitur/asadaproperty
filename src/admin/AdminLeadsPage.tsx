import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarCheck, Download, Inbox, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { paymentPlans, site, unitTypes } from "@/config/site";
import { WhatsAppIcon } from "@/landing/ui";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";

type Lead = Omit<Doc<"leads">, "clientId">;
type Status = Lead["status"];

const STATUSES: { id: Status; label: string; cls: string }[] = [
  { id: "baru", label: "Baru", cls: "bg-gold/25 text-gold-deep" },
  { id: "dihubungi", label: "Dihubungi", cls: "bg-info/15 text-forest" },
  { id: "survey", label: "Survey", cls: "bg-forest-soft/20 text-forest" },
  { id: "closing", label: "Closing", cls: "bg-forest text-cream" },
];

const planLabel = (p: string) => paymentPlans.find(x => x.id === p)?.label ?? p;
const unitLabel = (u: string) => unitTypes.find(x => x.id === u)?.label ?? u;
const sourceOf = (l: Lead) =>
  l.utmSource ??
  (l.fbclid
    ? "facebook"
    : l.gclid
      ? "google"
      : l.ttclid
        ? "tiktok"
        : "(langsung)");

function prettyPhone(p: string) {
  const local = `0${p.slice(2)}`;
  return local.replace(/(\d{4})(\d{4})(\d+)/, "$1 $2 $3");
}

function waFor(l: Lead) {
  const msg = `Halo ${l.name}, terima kasih sudah mengisi form ${site.name}. Saya dari tim marketing, ingin berbagi info harga & promo ${unitLabel(l.unitType)}.`;
  return `https://wa.me/${l.phone}?text=${encodeURIComponent(msg)}`;
}

function toCsv(rows: Lead[]) {
  const head = [
    "Tanggal",
    "Nama",
    "WhatsApp",
    "Domisili",
    "Pembayaran",
    "Tipe",
    "Survey",
    "Status",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
    "ttclid",
    "Landing URL",
    "Referrer",
    "User agent",
    "Jumlah kirim",
  ];
  const esc = (v: unknown) => {
    const s = v === undefined || v === null ? "" : String(v);
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const lines = rows.map(l =>
    [
      format(l._creationTime, "yyyy-MM-dd HH:mm"),
      l.name,
      l.phone,
      l.city,
      planLabel(l.paymentPlan),
      unitLabel(l.unitType),
      l.wantsSurvey ? "Ya" : "Tidak",
      l.status,
      l.utmSource,
      l.utmMedium,
      l.utmCampaign,
      l.utmContent,
      l.utmTerm,
      l.fbclid,
      l.gclid,
      l.ttclid,
      l.landingUrl,
      l.referrer,
      l.userAgent,
      l.submissions,
    ]
      .map(esc)
      .join(","),
  );
  return `\uFEFF${[head.join(","), ...lines].join("\n")}`;
}

function StatusSelect({ lead }: { lead: Lead }) {
  const setStatus = useMutation(api.leads.setStatus).withOptimisticUpdate(
    (store, { id, status }) => {
      const list = store.getQuery(api.leads.list, {});
      if (list)
        store.setQuery(
          api.leads.list,
          {},
          list.map(l => (l._id === id ? { ...l, status } : l)),
        );
    },
  );
  const cur = STATUSES.find(s => s.id === lead.status)!;
  return (
    <select
      aria-label={`Status ${lead.name}`}
      value={lead.status}
      onChange={e =>
        void setStatus({
          id: lead._id as Id<"leads">,
          status: e.target.value as Status,
        }).catch(() => toast.error("Gagal mengubah status"))
      }
      className={cn(
        "min-h-9 rounded-full border-0 px-3 pr-7 text-xs font-semibold",
        cur.cls,
      )}
    >
      {STATUSES.map(s => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

export default function AdminLeadsPage() {
  const leads = useQuery(api.leads.list, {});
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [campaign, setCampaign] = useState("");
  const [status, setStatus] = useState("");

  const sources = useMemo(
    () => [...new Set((leads ?? []).map(sourceOf))].sort(),
    [leads],
  );
  const campaigns = useMemo(
    () =>
      [
        ...new Set(
          (leads ?? []).map(l => l.utmCampaign).filter(Boolean) as string[],
        ),
      ].sort(),
    [leads],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const digits = needle.replace(/\D/g, "");
    return (leads ?? []).filter(l => {
      if (source && sourceOf(l) !== source) return false;
      if (campaign && l.utmCampaign !== campaign) return false;
      if (status && l.status !== status) return false;
      if (!needle) return true;
      return (
        l.name.toLowerCase().includes(needle) ||
        (l.city ?? "").toLowerCase().includes(needle) ||
        (digits.length >= 3 &&
          (l.phone.includes(digits) || `0${l.phone.slice(2)}`.includes(digits)))
      );
    });
  }, [leads, q, source, campaign, status]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads ?? []) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-villa-puncak-annisa-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectCls =
    "min-h-10 rounded-full border border-forest/15 bg-white px-3 text-sm text-ink focus:border-gold-deep focus:outline-none";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-semibold text-forest-deep">
            Leads
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            Calon pembeli dari form landing page, terbaru di atas.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!filtered.length}
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-forest px-4 text-sm font-semibold text-cream hover:bg-forest-deep disabled:opacity-50"
        >
          <Download className="size-4" aria-hidden="true" /> Export CSV
        </button>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="col-span-2 rounded-2xl bg-forest-deep p-4 text-cream sm:col-span-1">
          <dt className="text-xs text-cream/65">Total leads</dt>
          <dd className="font-heading text-3xl font-semibold text-gold">
            {leads?.length ?? "–"}
          </dd>
        </div>
        {STATUSES.map(s => (
          <div key={s.id} className="rounded-2xl bg-white p-4">
            <dt className="text-xs text-ink/70">{s.label}</dt>
            <dd className="font-heading text-3xl font-semibold text-forest-deep">
              {counts[s.id] ?? 0}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <label className="relative min-w-60 flex-1">
          <span className="sr-only">Cari leads</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari nama, nomor, atau kota"
            className="min-h-10 w-full rounded-full border border-forest/15 bg-white pr-4 pl-9 text-sm focus:border-gold-deep focus:outline-none"
          />
        </label>
        <select
          aria-label="Filter sumber"
          value={source}
          onChange={e => setSource(e.target.value)}
          className={selectCls}
        >
          <option value="">Semua sumber</option>
          {sources.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter campaign"
          value={campaign}
          onChange={e => setCampaign(e.target.value)}
          className={selectCls}
        >
          <option value="">Semua campaign</option>
          {campaigns.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          className={selectCls}
        >
          <option value="">Semua status</option>
          {STATUSES.map(s => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {leads === undefined ? (
        <p className="mt-10 text-sm text-ink/70" role="status">
          Memuat leads…
        </p>
      ) : filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center">
          <Inbox
            className="size-10 text-gold-deep"
            strokeWidth={1.4}
            aria-hidden="true"
          />
          <p className="font-heading mt-4 text-2xl font-semibold text-forest-deep">
            {leads.length === 0 ? "Belum ada leads" : "Tidak ada yang cocok"}
          </p>
          <p className="mt-1 max-w-sm text-sm text-ink/70">
            {leads.length === 0
              ? "Leads dari form landing page akan muncul di sini secara real-time."
              : "Ubah kata kunci atau filter untuk melihat leads lain."}
          </p>
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="relative mt-6 hidden overflow-x-auto rounded-3xl bg-white lg:block">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-ink/65">
                <tr className="border-b border-forest/10">
                  <th className="px-5 py-3 font-medium">Masuk</th>
                  <th className="px-3 py-3 font-medium">Nama</th>
                  <th className="px-3 py-3 font-medium">WhatsApp</th>
                  <th className="px-3 py-3 font-medium">Minat</th>
                  <th className="px-3 py-3 font-medium">Sumber / campaign</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr
                    key={l._id}
                    className="border-b border-forest/5 last:border-0 hover:bg-cream/60"
                    data-testid="lead-row"
                  >
                    <td className="px-5 py-3 whitespace-nowrap text-ink/70">
                      {format(l._creationTime, "d MMM yyyy, HH:mm", {
                        locale: localeId,
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-forest-deep">{l.name}</p>
                      <p className="text-xs text-ink/65">{l.city ?? "—"}</p>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                      {prettyPhone(l.phone)}
                    </td>
                    <td className="px-3 py-3">
                      <p>{unitLabel(l.unitType)}</p>
                      <p className="flex items-center gap-1 text-xs text-ink/65">
                        {planLabel(l.paymentPlan)}
                        {l.wantsSurvey && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/20 px-1.5 text-gold-deep">
                            <CalendarCheck
                              className="size-3"
                              aria-hidden="true"
                            />{" "}
                            Survey
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="max-w-56 px-3 py-3">
                      <p className="truncate">
                        {sourceOf(l)}
                        {l.utmMedium ? ` / ${l.utmMedium}` : ""}
                      </p>
                      <p className="truncate text-xs text-ink/65">
                        {l.utmCampaign ?? "—"}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <StatusSelect lead={l} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <a
                        href={waFor(l)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-wa px-3 text-xs font-semibold text-white hover:opacity-90"
                      >
                        <WhatsAppIcon className="size-4" /> Chat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* mobile cards */}
          <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:hidden">
            {filtered.map(l => (
              <li
                key={l._id}
                className="rounded-2xl bg-white p-4"
                data-testid="lead-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-forest-deep">{l.name}</p>
                    <p className="text-xs text-ink/65">
                      {format(l._creationTime, "d MMM, HH:mm", {
                        locale: localeId,
                      })}{" "}
                      · {l.city ?? "—"}
                    </p>
                  </div>
                  <StatusSelect lead={l} />
                </div>
                <p className="mt-3 text-sm">
                  {unitLabel(l.unitType)} · {planLabel(l.paymentPlan)}
                  {l.wantsSurvey ? " · Survey" : ""}
                </p>
                <p className="mt-0.5 truncate text-xs text-ink/65">
                  {sourceOf(l)}
                  {l.utmCampaign ? ` · ${l.utmCampaign}` : ""}
                </p>
                <a
                  href={waFor(l)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-wa text-sm font-semibold text-white"
                >
                  <WhatsAppIcon className="size-4" /> {prettyPhone(l.phone)}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
