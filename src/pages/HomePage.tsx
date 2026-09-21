import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "../sections/HeroSection";
import { JerseyShowcaseSection } from "../sections/JerseyShowcaseSection";
import { PartnersSection } from "../sections/PartnersSection";
import { AboutSection } from "../sections/AboutSection";
import { VideoHighlightsSection } from "../sections/VideoHighlightsSection";
import { useModals } from "../context/useModals";
import type { MediaItem } from "../data/media";

export const HomePage = () => {
  const navigate = useNavigate();
  const { openJersey, openVideo, openPartner } = useModals();

  useEffect(() => {
    document.title = "LORD ESPORTS — Compete. Conquer. Build Legacy.";
  }, []);

  const handlePlayHighlight = (item: MediaItem) => {
    openVideo({
      title: item.title,
      category: item.type,
      game: item.game,
      youtubeId: item.youtubeId,
    });
  };

  return (
    <div>
      {/* 1. Cinematic Parallax Hero */}
      <HeroSection
        onExploreTournaments={() => navigate("/tournaments")}
        onJoinLordz={() => navigate("/community")}
      />

      {/* 2. Forge Your Legacy / Pro Jersey Showcase Preview (Wear the Lordz) */}
      <JerseyShowcaseSection onShopJersey={openJersey} />

      {/* 3. Official Partners Showcase with Image & Animation */}
      <PartnersSection onPartnerWithUs={openPartner} showHeader={true} />

      {/* 4. About Us with Champion Team Image & Manifesto Text */}
      <AboutSection showHeader={true} />

      {/* 5. Curated Video Highlights */}
      <VideoHighlightsSection onPlayVideo={handlePlayHighlight} />
    </div>
  );
};
