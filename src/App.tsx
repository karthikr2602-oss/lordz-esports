import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { CustomCursor } from "./components/common/CustomCursor";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Navbar } from "./components/navbar/Navbar";
import { FooterSection } from "./sections/FooterSection";
import { ModalProvider } from "./context/ModalContext";
import { AuthProvider } from "./context/AuthContext";

// Public Pages
import { HomePage } from "./pages/HomePage";
import { TournamentsPage } from "./pages/TournamentsPage";
import { PlayersPage } from "./pages/PlayersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AboutPage } from "./pages/AboutPage";
import { NewsPage } from "./pages/NewsPage";
import { MediaPage } from "./pages/MediaPage";
import { CommunityPage } from "./pages/CommunityPage";
import { BrandPartnersPage } from "./pages/BrandPartnersPage";
import { PartnersPage } from "./pages/PartnersPage";
import { NotFoundPage } from "./pages/NotFoundPage";

/**
 * Public Layout with Lordz Header, Loading, Cursor, and Footer
 */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFBE32] selection:text-black relative flex flex-col justify-between">
      <ScrollToTop />
      <LoadingScreen />
      <CustomCursor />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            {/* Public Esports Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/players" element={<PlayersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/jersey" element={<Navigate to="/products" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/hall-of-glory" element={<Navigate to="/tournaments" replace />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/partners" element={<BrandPartnersPage />} />
              <Route path="/partner-with-us" element={<PartnersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
