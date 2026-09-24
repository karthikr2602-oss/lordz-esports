import { PageHero } from "../components/common/PageHero";
import { AboutSection } from "../sections/AboutSection";
import { StatsSection } from "../sections/StatsSection";
import { SEO } from "../components/common/SEO";
import { buildOrganizationSchema } from "../config/seo";

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050505]">
      <SEO
        title="About LORDZ ESPORTS | Organization History, Manifesto &amp; Achievements"
        description="Learn about LORDZ ESPORTS, India's premier competitive mobile esports organization. Built on discipline, South Indian cultural identity, and championship-tier tournament performance."
        canonicalPath="/about"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "About", item: "/about" },
        ]}
        structuredData={buildOrganizationSchema()}
      />

      <PageHero
        badge="ORGANIZATION PROFILE"
        title="ABOUT"
        titleHighlight="LORD"
        subtitle="Born from the fierce competitive pulse of Indian mobile gaming, building legacy through discipline, culture, and dominance."
      />

      <AboutSection showHeader={false} />
      <StatsSection />
    </div>
  );
};
