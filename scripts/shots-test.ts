// bun run test scripts/shots-test.ts — marketing screenshots at 390 & 1440
import { mkdirSync } from "node:fs";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { runTest } from "./auth";

const OUT = process.env.SHOTS_DIR || "tmp/shots";
mkdirSync(OUT, { recursive: true });

async function scrollThrough(page: Page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(120);
  }
}

async function goSection(page: Page, id: string, offset = 0) {
  await page.evaluate(
    ([sid, off]) => {
      const el = document.getElementById(sid as string)!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70 + (off as number));
    },
    [id, offset],
  );
  await page.waitForTimeout(1400);
}

runTest("Screenshots", async helper => {
  const stamp = Date.now();
  for (const [label, width, height] of [
    ["mobile", 390, 844],
    ["desktop", 1440, 900],
  ] as const) {
    const ctx = await helper.browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: label === "mobile" ? 2 : 1,
      reducedMotion: "no-preference",
    });
    const page = await ctx.newPage();
    await page.goto(`${process.env.APP_URL}/?utm_source=instagram&utm_medium=paid&utm_campaign=promo-oktober`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `${OUT}/${label}-1-hero.png` });
    await scrollThrough(page);
    await goSection(page, "promo", -20);
    await page.screenshot({ path: `${OUT}/${label}-1b-promo.png` });
    await goSection(page, "nuansa");
    await page.screenshot({ path: `${OUT}/${label}-2-nuansa.png` });
    await goSection(page, "fasilitas");
    await page.screenshot({ path: `${OUT}/${label}-3-fasilitas.png` });
    await goSection(page, "denah");
    await page.screenshot({ path: `${OUT}/${label}-4-denah.png` });
    await goSection(page, "spesifikasi");
    await page.screenshot({ path: `${OUT}/${label}-5-spesifikasi.png` });
    await goSection(page, "kpr", -20);
    await page.screenshot({ path: `${OUT}/${label}-5b-kpr.png` });
    if (label === "desktop") {
      const fab = page.getByRole("link", { name: "Chat via WhatsApp" });
      await expect(fab).toHaveAttribute("href", /^https:\/\/wa\.me\/6285647457015\?text=.+/);
    }
    await goSection(page, "daftar");
    await page.screenshot({ path: `${OUT}/${label}-6-form.png` });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${label}-full.png`, fullPage: true });

    const form = page.getByRole("form", { name: /Form info harga/ });
    await goSection(page, "daftar");
    await form.getByLabel("Nama").fill(label === "mobile" ? "Rina Putri" : "Budi Santoso");
    await form.getByLabel("Nomor WhatsApp").fill(`0813${String(stamp + width).slice(-8)}`);
    await form.getByLabel(/Domisili/).fill(label === "mobile" ? "Malang" : "Surabaya");
    await form.getByText(label === "mobile" ? "KPR" : "Cash Bertahap", { exact: true }).click();
    await form.getByText(label === "mobile" ? "Type 40/66" : "Type 75 2 Lantai", { exact: true }).click();
    await form.getByRole("button", { name: /Kirim/ }).click();
    await expect(page.getByTestId("thank-you")).toBeVisible();
    await page.waitForTimeout(300);
    await page.getByTestId("thank-you").evaluate(el => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${label}-7-thankyou.png` });
    await ctx.close();
  }

  const p = helper.page;
  for (const [label, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ] as const) {
    await p.setViewportSize({ width, height });
    await helper.goto("/admin");
    await expect(p.getByRole("heading", { name: "Leads" })).toBeVisible();
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}/${label}-8-admin.png` });
  }
}).catch(() => process.exit(1));
