import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { PartnersSection } from "../sections/PartnersSection";
import { useModals } from "../context/useModals";

export const PartnersPage = () => {
  const { openPartner } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Official Sponsors & Brand Partners";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="SPONSORSHIP & INTEGRATIONS"
        title="OUR BRAND"
        titleHighlight="PARTNERS"
        subtitle="Empowering the future of Indian competitive esports through premier technological, hardware, and broadcast collaborations."
      />

      <PartnersSection onPartnerWithUs={openPartner} showHeader={false} />
    </div>
  );
};
