// bun run test scripts/leads-test.ts
import { expect } from "@playwright/test";
import { runTest } from "./auth";

runTest("Lead form stores a lead with UTMs; admin lists it", async helper => {
  const stamp = Date.now();
  const name = `Uji Coba ${stamp.toString(36)}`;
  const phone = `0812${String(stamp).slice(-8)}`;
  const campaign = `e2e-${stamp}`;

  const visitor = await helper.browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await visitor.newPage();
  const base = process.env.APP_URL!;
  await page.goto(
    `${base}/?utm_source=facebook&utm_medium=paid&utm_campaign=${campaign}&fbclid=fb-${stamp}`,
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "nuansa villa",
  );

  // UTMs persist after the query string is gone (sessionStorage)
  await page.evaluate(() => history.replaceState(null, "", "/"));

  const form = page.getByRole("form", { name: /Form info harga/ });
  await form.scrollIntoViewIfNeeded();

  // validation
  await form.getByRole("button", { name: /Kirim/ }).click();
  await expect(form.getByText("Mohon isi nama Anda")).toBeVisible();
  await expect(form.getByText("Mohon isi nomor WhatsApp")).toBeVisible();
  await expect(form.getByText("Pilih rencana pembayaran")).toBeVisible();
  await expect(form.getByText("Pilih tipe rumah")).toBeVisible();

  await form.getByLabel("Nama").fill(name);
  await form.getByLabel("Nomor WhatsApp").fill("12345");
  await form.getByRole("button", { name: /Kirim/ }).click();
  await expect(form.getByText(/Nomor WhatsApp tidak valid/)).toBeVisible();

  await form.getByLabel("Nomor WhatsApp").fill(phone);
  await form.getByLabel(/Domisili/).fill("Surabaya");
  await form.getByText("KPR", { exact: true }).click();
  await form.getByText("Type 40/66", { exact: true }).click();
  await form.getByText("Jadwalkan survey lokasi").click();
  await form.getByRole("button", { name: /Kirim/ }).click();

  await expect(page.getByTestId("thank-you")).toBeVisible();
  await expect(page.getByText(/Terima kasih, Uji!/)).toBeVisible();

  // WhatsApp: thank-you button carries name + type, to the marketing number
  const chat = page.getByRole("link", { name: "Chat Marketing via WhatsApp" });
  const chatHref = (await chat.getAttribute("href"))!;
  if (!chatHref.startsWith("https://wa.me/6285647457015?text="))
    throw new Error(`bad chat href ${chatHref}`);
  const chatText = decodeURIComponent(chatHref.split("text=")[1]);
  if (!chatText.includes(name) || !chatText.includes("Type 40/66"))
    throw new Error(`chat text missing name/type: ${chatText}`);

  // sticky mobile bar WhatsApp (visible once the form is off screen)
  await page.evaluate(() => window.scrollTo(0, 1200));
  const barWa = page.getByRole("link", { name: "WhatsApp", exact: true });
  await expect(barWa).toBeVisible();
  await expect(barWa).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/6285647457015\?text=.+/,
  );
  await visitor.close();

  // admin (signed in)
  await helper.goto("/admin");
  const p = helper.page;
  await expect(p.getByRole("heading", { name: "Leads" })).toBeVisible();
  await p.getByPlaceholder(/Cari nama/).fill(name);
  const row = p.getByTestId("lead-row").filter({ hasText: name });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("facebook / paid");
  await expect(row).toContainText(campaign);
  await expect(row).toContainText("Type 40/66");
  await expect(row).toContainText("Survey");
  const normalized = `62${phone.slice(1)}`;
  await expect(row.getByRole("link", { name: /Chat/ })).toHaveAttribute(
    "href",
    new RegExp(`wa.me/${normalized}`),
  );

  // status edit
  await row.getByRole("combobox", { name: /Status/ }).selectOption("dihubungi");
  await expect(row.getByRole("combobox", { name: /Status/ })).toHaveValue(
    "dihubungi",
  );
}).catch(() => process.exit(1));
