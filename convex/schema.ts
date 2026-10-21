import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const leadStatus = v.union(
  v.literal("baru"),
  v.literal("dihubungi"),
  v.literal("survey"),
  v.literal("closing"),
);

export const paymentPlan = v.union(
  v.literal("kpr"),
  v.literal("cash_bertahap"),
  v.literal("cash_keras"),
);

export const unitType = v.union(v.literal("type40"), v.literal("type75"));

const schema = defineSchema({
  ...authTables,
  leads: defineTable({
    name: v.string(),
    phone: v.string(), // normalized 62…
    city: v.optional(v.string()),
    paymentPlan,
    unitType,
    wantsSurvey: v.boolean(),
    status: leadStatus,
    // attribution
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
    submissions: v.number(),
    lastSubmittedAt: v.number(),
  })
    .index("by_phone", ["phone"])
    .index("by_clientId", ["clientId"]),
});

export default schema;
