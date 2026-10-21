import { lazy, Suspense, useCallback, useState } from "react";
import { Facilities } from "./Facilities";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { type GalleryImage, gallery } from "./gallery";
import { LeadSection } from "./LeadSection";
import { Kpr, Location } from "./LocationKpr";
import { MobileBar } from "./MobileBar";
import { Nuansa } from "./Nuansa";
import { PlanSection } from "./PlanSection";
import { PromoStrip } from "./PromoStrip";
import { Specs } from "./Specs";

const Lightbox = lazy(() => import("./Lightbox"));

export default function BelowFold() {
  const [open, setOpen] = useState<number | null>(null);
  const openImage = useCallback((img: GalleryImage) => {
    setOpen(gallery.findIndex(g => g.id === img.id));
  }, []);

  return (
    <>
      <PromoStrip />
      <Nuansa onOpenImage={openImage} />
      <Facilities />
      <PlanSection onOpenImage={openImage} />
      <Specs />
      <Kpr />
      <Location />
      <LeadSection />
      <Faq />
      <Footer />
      <MobileBar />
      {open !== null && (
        <Suspense fallback={null}>
          <Lightbox
            images={gallery}
            index={open}
            onIndex={setOpen}
            onClose={() => setOpen(null)}
          />
        </Suspense>
      )}
    </>
  );
}
