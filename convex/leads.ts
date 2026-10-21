import { ConvexError, v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./functions";
import { cleanName, normalizeIndoPhone, validateName } from "./leadRules";
import { leadStatus, paymentPlan, unitType } from "./schema";

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;
const CLIENT_WINDOW_MS = 60 * 60 * 1000;
const CLIENT_MAX_PER_WINDOW = 5;

function clip(value: string | undefined, max: number): string | undefined {
  if (value === undefined) return undefined;
  const t = value.trim();
  return t ? t.slice(0, max) : undefined;
}

const attribution = {
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  utmContent: v.optional(v.string()),
  utmTerm: v.optional(v.string()),
  fbclid: v.optional(v.string()),
  gclid: v.optional(v.string()),
  ttclid: v.optional(v.string()),
  landingUrl: v.optional(v.string()),
  referrer: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  clientId: v.optional(v.string()),
};

/**
 * Deliberately anonymous: the public landing page's lead form. Strict
 * validation, honeypot, per-browser rate limit and phone dedupe.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    city: v.optional(v.string()),
    paymentPlan,
    unitType,
    wantsSurvey: v.boolean(),
    website: v.optional(v.string()), // honeypot: humans leave it empty
    ...attribution,
  },
  returns: v.object({ ok: v.boolean(), duplicate: v.boolean() }),
  handler: async (ctx, args) => {
    if (args.website && args.website.trim() !== "") {
      // Bot: pretend success, store nothing.
      return { ok: true, duplicate: false };
    }
    const nameError = validateName(args.name);
    if (nameError) throw new ConvexError(nameError);
    const phone = normalizeIndoPhone(args.phone);
    if (!phone) throw new ConvexError("Nomor WhatsApp tidak valid");
    const city = clip(args.city, 60);
    if (city && /https?:|www\.|<|>/i.test(city)) {
      throw new ConvexError("Domisili tidak valid");
    }

    const now = Date.now();
    const clientId = clip(args.clientId, 64);
    if (clientId) {
      const recent = await ctx.db
        .query("leads")
        .withIndex("by_clientId", q => q.eq("clientId", clientId))
        .order("desc")
        .take(CLIENT_MAX_PER_WINDOW + 1);
      const inWindow = recent.filter(
        l => now - l.lastSubmittedAt < CLIENT_WINDOW_MS,
      );
      if (inWindow.length >= CLIENT_MAX_PER_WINDOW) {
        throw new ConvexError(
          "Terlalu banyak pengiriman. Silakan coba lagi nanti.",
        );
      }
    }

    const existing = await ctx.db
      .query("leads")
      .withIndex("by_phone", q => q.eq("phone", phone))
      .order("desc")
      .first();
    if (existing && now - existing.lastSubmittedAt < DEDUPE_WINDOW_MS) {
      await ctx.db.patch(existing._id, {
        submissions: existing.submissions + 1,
        lastSubmittedAt: now,
        unitType: args.unitType,
        paymentPlan: args.paymentPlan,
        wantsSurvey: existing.wantsSurvey || args.wantsSurvey,
        city: city ?? existing.city,
      });
      return { ok: true, duplicate: true };
    }

    await ctx.db.insert("leads", {
      name: cleanName(args.name),
      phone,
      city,
      paymentPlan: args.paymentPlan,
      unitType: args.unitType,
      wantsSurvey: args.wantsSurvey,
      status: "baru",
      utmSource: clip(args.utmSource, 120),
      utmMedium: clip(args.utmMedium, 120),
      utmCampaign: clip(args.utmCampaign, 200),
      utmContent: clip(args.utmContent, 200),
      utmTerm: clip(args.utmTerm, 200),
      fbclid: clip(args.fbclid, 300),
      gclid: clip(args.gclid, 300),
      ttclid: clip(args.ttclid, 300),
      landingUrl: clip(args.landingUrl, 1000),
      referrer: clip(args.referrer, 1000),
      userAgent: clip(args.userAgent, 400),
      clientId,
      submissions: 1,
      lastSubmittedAt: now,
    });
    return { ok: true, duplicate: false };
  },
});

const leadDoc = v.object({
  _id: v.id("leads"),
  _creationTime: v.number(),
  name: v.string(),
  phone: v.string(),
  city: v.optional(v.string()),
  paymentPlan,
  unitType,
  wantsSurvey: v.boolean(),
  status: leadStatus,
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  utmContent: v.optional(v.string()),
  utmTerm: v.optional(v.string()),
  fbclid: v.optional(v.string()),
  gclid: v.optional(v.string()),
  ttclid: v.optional(v.string()),
  landingUrl: v.optional(v.string()),
  referrer: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  submissions: v.number(),
  lastSubmittedAt: v.number(),
});

/** Newest first; capped so one query stays inside Convex limits. */
export const list = authenticatedQuery({
  args: {},
  returns: v.array(leadDoc),
  handler: async ctx => {
    const rows = await ctx.db.query("leads").order("desc").take(2000);
    return rows.map(({ clientId: _c, ...rest }: Doc<"leads">) => rest);
  },
});

export const setStatus = authenticatedMutation({
  args: { id: v.id("leads"), status: leadStatus },
  returns: v.null(),
  handler: async (ctx, { id, status }) => {
    const lead = await ctx.db.get(id);
    if (!lead) throw new ConvexError("Lead tidak ditemukan");
    await ctx.db.patch(id, { status });
    return null;
  },
});
