import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "../sections/HeroSection";
import { LiveStatusBar } from "../sections/LiveStatusBar";
import { JerseyShowcaseSection } from "../sections/JerseyShowcaseSection";
import { VideoHighlightsSection } from "../sections/VideoHighlightsSection";
import { useModals } from "../context/useModals";
import type { MediaItem } from "../data/media";

export const HomePage = () => {
  const navigate = useNavigate();
  const { openJoinTournament, openJersey, openVideo } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Compete. Conquer. Build Legacy.";
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
        onJoinLordz={() => openJoinTournament()}
      />

      {/* 2. Compact Live Status Bar */}
      <LiveStatusBar
        onViewMatch={() =>
          openVideo({
            title: "FLAME OF GLORY • GRAND FINALS MATCH 3",
            category: "LIVE MATCH",
            game: "FREE FIRE MAX",
          })
        }
      />

      {/* 3. Forge Your Legacy / Pro Jersey Showcase Preview */}
      <JerseyShowcaseSection onShopJersey={openJersey} />

      {/* 4. Curated Video Highlights (3-Card Layout with View All -> /media) */}
      <VideoHighlightsSection onPlayVideo={handlePlayHighlight} />
    </div>
  );
};
