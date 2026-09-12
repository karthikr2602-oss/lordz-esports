import { useEffect } from "react";
import { PageHero } from "../components/common/PageHero";
import { MediaSection } from "../sections/MediaSection";
import { useModals } from "../context/useModals";

export const MediaPage = () => {
  const { playMedia } = useModals();

  useEffect(() => {
    document.title = "LORDZ ESPORTS — Media Hub, Highlights & Streams";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <PageHero
        badge="CINEMATICS & CLUTCHES"
        title="LORDZ"
        titleHighlight="MEDIA HUB"
        subtitle="Match replays, clutch compilations, athlete shorts, behind-the-scenes gallery, and official broadcast documentaries."
      />

      <MediaSection onPlayMedia={playMedia} showHeader={false} />
    </div>
  );
};
