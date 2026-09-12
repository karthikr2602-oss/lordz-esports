import { useState, type ReactNode } from "react";
import type { Tournament } from "../data/tournaments";
import type { Match } from "../data/matches";
import type { MediaItem } from "../data/media";
import type { NewsArticle } from "../data/news";
import { JoinTournamentModal } from "../components/modals/JoinTournamentModal";
import { LoginModal } from "../components/modals/LoginModal";
import { VideoModal } from "../components/modals/VideoModal";
import { JerseyModal } from "../components/modals/JerseyModal";
import { Modal } from "../components/common/Modal";
import { ModalContext, type VideoPayload } from "./modalContextDef";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  // Modal visibility states
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [jerseyModalOpen, setJerseyModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  // Active payloads
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoPayload>({
    title: "FLAME OF GLORY S2 • OFFICIAL TRAILER",
    category: "OFFICIAL STREAM",
    game: "FREE FIRE MAX",
  });
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const openJoinTournament = (tournament?: Tournament) => {
    setSelectedTournament(tournament || null);
    setJoinModalOpen(true);
  };

  const closeJoinTournament = () => {
    setJoinModalOpen(false);
  };

  const openLogin = () => setLoginModalOpen(true);
  const closeLogin = () => setLoginModalOpen(false);

  const openJersey = () => setJerseyModalOpen(true);
  const closeJersey = () => setJerseyModalOpen(false);

  const openVideo = (video: VideoPayload) => {
    setSelectedVideo(video);
    setVideoModalOpen(true);
  };

  const closeVideo = () => setVideoModalOpen(false);

  const watchMatch = (match: Match) => {
    setSelectedVideo({
      title: `${match.teamA.name} VS ${match.teamB.name} • ${match.tournament}`,
      category: match.status === "LIVE" ? "LIVE BROADCAST" : "MATCH VOD",
      game: match.game,
    });
    setVideoModalOpen(true);
  };

  const playMedia = (item: MediaItem) => {
    setSelectedVideo({
      title: item.title,
      category: item.type,
      game: item.game,
      youtubeId: item.youtubeId,
    });
    setVideoModalOpen(true);
  };

  const openArticle = (article: NewsArticle) => setSelectedArticle(article);
  const closeArticle = () => setSelectedArticle(null);

  const openPartner = () => setPartnerModalOpen(true);
  const closePartner = () => setPartnerModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        openJoinTournament,
        closeJoinTournament,
        openLogin,
        closeLogin,
        openJersey,
        closeJersey,
        openVideo,
        closeVideo,
        watchMatch,
        playMedia,
        openArticle,
        closeArticle,
        openPartner,
        closePartner,
      }}
    >
      {children}

      {/* Global Modals Mounted */}
      <JoinTournamentModal
        isOpen={joinModalOpen}
        onClose={closeJoinTournament}
        tournamentTitle={selectedTournament?.title || "FLAME OF GLORY S2"}
        game={selectedTournament?.game || "FREE FIRE MAX"}
        prizePool={selectedTournament?.prizePool || "₹50,000"}
      />

      <LoginModal isOpen={loginModalOpen} onClose={closeLogin} />

      <VideoModal
        isOpen={videoModalOpen}
        onClose={closeVideo}
        title={selectedVideo.title}
        category={selectedVideo.category}
        game={selectedVideo.game}
      />

      <JerseyModal isOpen={jerseyModalOpen} onClose={closeJersey} />

      {/* News Article Detail Modal */}
      <Modal
        isOpen={!!selectedArticle}
        onClose={closeArticle}
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
        onClose={closePartner}
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
            onClick={closePartner}
            className="w-full py-2.5 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#FFBE32] text-black hover:bg-[#FFCD59] transition-all cursor-pointer"
          >
            REQUEST PARTNERSHIP PROSPECTUS
          </button>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
};

