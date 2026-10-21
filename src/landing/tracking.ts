import { site } from "@/config/site";

const KEY = "vpa:attribution";
const CLIENT_KEY = "vpa:client";
const PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  landingUrl?: string;
  referrer?: string;
}

const toKey: Record<(typeof PARAMS)[number], keyof Attribution> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  fbclid: "fbclid",
  gclid: "gclid",
  ttclid: "ttclid",
};

/** Keep the first landing's ad params for the whole session. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const a: Attribution = {
      landingUrl: window.location.href,
      referrer: document.referrer || undefined,
    };
    for (const p of PARAMS) {
      const val = q.get(p);
      if (val) a[toKey[p]] = val;
    }
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    // storage blocked: getAttribution falls back to the current URL
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // ignore
  }
  const q = new URLSearchParams(window.location.search);
  const a: Attribution = {
    landingUrl: window.location.href,
    referrer: document.referrer || undefined,
  };
  for (const p of PARAMS) {
    const val = q.get(p);
    if (val) a[toKey[p]] = val;
  }
  return a;
}

export function getClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

let pixelsStarted = false;

/** Inject Meta Pixel / Google tag only when IDs are configured, after idle. */
export function initPixels(): void {
  if (pixelsStarted) return;
  pixelsStarted = true;
  const start = () => {
    if (site.metaPixelId && !window.fbq) {
      const fbq: Fbq = (...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue?.push(args);
      };
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.push = fbq;
      window.fbq = fbq;
      window._fbq = fbq;
      loadScript("https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", site.metaPixelId);
      fbq("track", "PageView");
    }
    if (site.googleTagId && !window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // biome-ignore lint/complexity/noArguments: gtag requires the arguments object
        window.dataLayer?.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", site.googleTagId);
      loadScript(
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.googleTagId)}`,
      );
    }
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 3000 });
  } else {
    setTimeout(start, 1500);
  }
}

export function trackLead(unitLabel: string): void {
  try {
    window.fbq?.("track", "Lead", { content_name: unitLabel });
    if (window.gtag) {
      window.gtag("event", "generate_lead", { item_name: unitLabel });
      if (site.googleAdsLeadSendTo) {
        window.gtag("event", "conversion", {
          send_to: site.googleAdsLeadSendTo,
        });
      }
    }
  } catch {
    // never block the thank-you state on tracking
  }
}
