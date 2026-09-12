import { useState } from "react";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { CustomCursor } from "./components/common/CustomCursor";
import { Navbar } from "./components/navbar/Navbar";
import { HeroSection } from "./sections/HeroSection";
import { LiveStatusBar } from "./sections/LiveStatusBar";
import { TournamentsSection } from "./sections/TournamentsSection";
import { FlameOfGlorySection } from "./sections/FlameOfGlorySection";
import { MatchCenterSection } from "./sections/MatchCenterSection";
import { TeamsSection } from "./sections/TeamsSection";
import { PlayersSection } from "./sections/PlayersSection";
import { JerseyShowcaseSection } from "./sections/JerseyShowcaseSection";
import { AboutSection } from "./sections/AboutSection";
import { StatsSection } from "./sections/StatsSection";
import { HallOfGlorySection } from "./sections/HallOfGlorySection";
import { NewsSection } from "./sections/NewsSection";
import { MediaSection } from "./sections/MediaSection";
import { CommunitySection } from "./sections/CommunitySection";
import { PartnersSection } from "./sections/PartnersSection";
import { FooterSection } from "./sections/FooterSection";

// Modals
import { JoinTournamentModal } from "./components/modals/JoinTournamentModal";
import { LoginModal } from "./components/modals/LoginModal";
import { VideoModal } from "./components/modals/VideoModal";
import { JerseyModal } from "./components/modals/JerseyModal";
import { Modal } from "./components/common/Modal";

// Data types
import type { Tournament } from "./data/tournaments";
import type { Match } from "./data/matches";
import type { MediaItem } from "./data/media";
import type { NewsArticle } from "./data/news";

export function App() {
  // Modal states
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [jerseyModalOpen, setJerseyModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  // Selected items for contextual modals
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; category: string; game: string }>({
    title: "FLAME OF GLORY S2 • OFFICIAL TRAILER",
    category: "OFFICIAL STREAM",
    game: "FREE FIRE MAX",
  });
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Handler helpers
  const handleOpenJoinWithTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setJoinModalOpen(true);
  };

  const handleWatchMatch = (match: Match) => {
    setSelectedVideo({
      title: `${match.teamA.name} VS ${match.teamB.name} • ${match.tournament}`,
      category: match.status === "LIVE" ? "LIVE BROADCAST" : "MATCH VOD",
      game: match.game,
    });
    setVideoModalOpen(true);
  };

  const handlePlayMedia = (item: MediaItem) => {
    setSelectedVideo({
      title: item.title,
      category: item.type,
      game: item.game,
    });
    setVideoModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFBE32] selection:text-black relative">
      {/* 1. Loading Experience */}
      <LoadingScreen />

      {/* 2. Desktop Magnetic Gold Custom Cursor */}
      <CustomCursor />

      {/* 3. Sticky Navbar */}
      <Navbar
        onOpenJoin={() => {
          setSelectedTournament(null);
          setJoinModalOpen(true);
        }}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenShop={() => setJerseyModalOpen(true)}
      />

      {/* 4. Hero Section with Mouse Parallax & Official Jersey Presentation */}
      <HeroSection
        onExploreTournaments={() => scrollToSection("tournaments")}
        onJoinLordz={() => setJoinModalOpen(true)}
      />

      {/* 5. Live Status Bar */}
      <LiveStatusBar
        onViewMatch={() => {
          setSelectedVideo({
            title: "FLAME OF GLORY • GRAND FINALS MATCH 3",
            category: "LIVE MATCH",
            game: "FREE FIRE MAX",
          });
          setVideoModalOpen(true);
        }}
      />

      {/* 6. Tournaments & Interactive Filter Arena */}
      <TournamentsSection onSelectTournament={handleOpenJoinWithTournament} />

      {/* 7. Flame of Glory Overall Standings Leaderboard */}
      <FlameOfGlorySection onOpenJoin={() => setJoinModalOpen(true)} />

      {/* 8. Match Center (Live, Upcoming Countdown, Results) */}
      <MatchCenterSection onWatchMatch={handleWatchMatch} />

      {/* 9. The Battlefield (Teams & Rankings) */}
      <TeamsSection onExploreTeams={() => scrollToSection("flame-of-glory")} />

      {/* 10. Meet the Players (Sports Trading Cards, Beast IGL) */}
      <PlayersSection />

      {/* 11. Wear the Lordz (Jersey Showcase Front/Back Interactive Switcher) */}
      <JerseyShowcaseSection onShopJersey={() => setJerseyModalOpen(true)} />

      {/* 12. THIS IS LORDZ (Manifesto Typography & Temple Line Art) */}
      <AboutSection />

      {/* 13. Minimal Numeric Stats Counter */}
      <StatsSection />

      {/* 14. Hall of Glory (Achievements Timeline) */}
      <HallOfGlorySection />

      {/* 15. Latest From Lordz (Editorial News) */}
      <NewsSection onSelectArticle={(article) => setSelectedArticle(article)} />

      {/* 16. Lordz Media (Videos, Highlights, Photos, Shorts) */}
      <MediaSection onPlayMedia={handlePlayMedia} />

      {/* 17. Join the Community (Discord, WhatsApp, Instagram, YouTube) */}
      <CommunitySection />

      {/* 18. Our Partners (Clean Logo Wall) */}
      <PartnersSection onPartnerWithUs={() => setPartnerModalOpen(true)} />

      {/* 19. Grand Footer */}
      <FooterSection
        onOpenJoin={() => setJoinModalOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenShop={() => setJerseyModalOpen(true)}
      />

      {/* ================= MODALS ================= */}

      {/* Join Tournament Modal */}
      <JoinTournamentModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        tournamentTitle={selectedTournament?.title || "FLAME OF GLORY S2"}
        game={selectedTournament?.game || "FREE FIRE MAX"}
        prizePool={selectedTournament?.prizePool || "₹50,000"}
      />

      {/* Athlete Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Broadcast / Video Player Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title={selectedVideo.title}
        category={selectedVideo.category}
        game={selectedVideo.game}
      />

      {/* Jersey Pre-Order Modal */}
      <JerseyModal
        isOpen={jerseyModalOpen}
        onClose={() => setJerseyModalOpen(false)}
      />

      {/* News Article Detail Modal */}
      <Modal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || "NEWS DISPATCH"}
        subtitle={`${selectedArticle?.category} • ${selectedArticle?.date}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-sm text-gray-300 font-body">
          <p className="text-base leading-relaxed text-white font-semibold">
            {selectedArticle?.excerpt}
          </p>
          <p className="leading-relaxed">
            As competitive esports across India enters an unprecedented era of professionalization, Lordz Esports continues to establish the gold standard for player development, scrim infrastructure, and fair play.
          </p>
          <p className="leading-relaxed text-gray-400">
            For further media inquiries, caster accreditation, or official scrim invites, please reach out directly through our Discord community portal.
          </p>
          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500 font-mono">
            <span>Author: {selectedArticle?.author}</span>
            <span>Ref ID: #{selectedArticle?.id}</span>
          </div>
        </div>
      </Modal>

      {/* Partner Inquiries Modal */}
      <Modal
        isOpen={partnerModalOpen}
        onClose={() => setPartnerModalOpen(false)}
        title="PARTNER WITH LORDZ"
        subtitle="Sponsorship, Brand Integrations & Broadcast Rights"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-300 font-body">
            Position your brand at the center of Indian youth culture and competitive gaming. Lordz Esports provides tailored tournament naming rights, jersey sleeve placements, and broadcast integrations.
          </p>
          <div className="p-4 rounded-lg bg-black/60 border border-white/10 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Commercial Desk:</span>
              <span className="text-[#FFBE32]">partners@lordzesports.gg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Headquarters:</span>
              <span className="text-white">Chennai, India</span>
            </div>
          </div>
          <button
            onClick={() => setPartnerModalOpen(false)}
            className="w-full py-2.5 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#FFBE32] text-black hover:bg-[#FFCD59] transition-all cursor-pointer"
          >
            REQUEST PARTNERSHIP PROSPECTUS
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
