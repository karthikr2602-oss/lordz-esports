import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { CustomCursor } from "./components/common/CustomCursor";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Navbar } from "./components/navbar/Navbar";
import { FooterSection } from "./sections/FooterSection";
import { ModalProvider } from "./context/ModalContext";

// Pages
import { HomePage } from "./pages/HomePage";
import { TournamentsPage } from "./pages/TournamentsPage";
import { FlameOfGloryPage } from "./pages/FlameOfGloryPage";
import { MatchesPage } from "./pages/MatchesPage";
import { TeamsPage } from "./pages/TeamsPage";
import { PlayersPage } from "./pages/PlayersPage";
import { JerseyPage } from "./pages/JerseyPage";
import { AboutPage } from "./pages/AboutPage";
import { HallOfGloryPage } from "./pages/HallOfGloryPage";
import { NewsPage } from "./pages/NewsPage";
import { MediaPage } from "./pages/MediaPage";
import { CommunityPage } from "./pages/CommunityPage";
import { PartnersPage } from "./pages/PartnersPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFBE32] selection:text-black relative flex flex-col justify-between">
          {/* 1. Global Scroll Reset */}
          <ScrollToTop />

          {/* 2. Loading Experience on First Visit */}
          <LoadingScreen />

          {/* 3. Desktop Magnetic Gold Custom Cursor */}
          <CustomCursor />

          {/* 4. Global Sticky Header Navigation */}
          <Navbar />

          {/* 5. Main Route View */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/flame-of-glory" element={<FlameOfGloryPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/jersey" element={<JerseyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/hall-of-glory" element={<HallOfGloryPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* 6. Global Shared Footer */}
          <FooterSection />
        </div>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
