import { AnimatePresence, m } from "framer-motion";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultWaMessage, whatsappLink } from "@/config/site";
import { scrollToId, WhatsAppIcon } from "./ui";

function useBarVisible() {
  const [pastHero, setPastHero] = useState(false);
  const [formInView, setFormInView] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const form = document.getElementById("daftar");
    let io: IntersectionObserver | undefined;
    if (form) {
      io = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), {
        threshold: 0.15,
      });
      io.observe(form);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);
  return { pastHero, formInView };
}

function WaAnchor({
  className,
  children,
  label,
}: {
  className: string;
  children: React.ReactNode;
  label?: string;
}) {
  const href = whatsappLink(defaultWaMessage);
  if (!href) {
    return (
      <button
        type="button"
        onClick={() => scrollToId("daftar")}
        className={className}
        aria-label={label}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
    >
      {children}
    </a>
  );
}

export function MobileBar() {
  const { pastHero, formInView } = useBarVisible();
  const show = pastHero && !formInView;
  return (
    <>
      {/* mobile bottom bar */}
      <AnimatePresence>
        {show && (
          <m.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-forest-deep/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scrollToId("daftar")}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold-sheen text-[15px] font-semibold text-forest-deep"
              >
                <FileText className="size-4" aria-hidden="true" />
                Isi Form
              </button>
              <WaAnchor className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-wa text-[15px] font-semibold text-white">
                <WhatsAppIcon />
                WhatsApp
              </WaAnchor>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* floating WhatsApp (tablet / desktop) */}
      <AnimatePresence>
        {pastHero && (
          <m.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed right-6 bottom-6 z-40 hidden md:block"
          >
            <WaAnchor
              label="Chat via WhatsApp"
              className="group relative grid size-14 place-items-center rounded-full bg-wa text-white shadow-[0_14px_30px_-10px_oklch(0.4_0.12_150/0.8)] transition-transform hover:scale-105"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-wa/40 motion-reduce:hidden [animation-duration:2.4s]"
              />
              <WhatsAppIcon className="relative size-7" />
            </WaAnchor>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
