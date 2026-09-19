import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import { Menu } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { MobileMenu } from "./MobileMenu";
import { useModals } from "../../context/useModals";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck } from "lucide-react";

// Straight Desktop Nav Items (No 'MORE' dropdown, 'JERSEY' replaced with 'PRODUCTS', 'HALL OF GLORY' removed)
const straightNavItems = [
  { label: "HOME", path: "/" },
  { label: "TOURNAMENTS", path: "/tournaments" },
  { label: "PLAYERS", path: "/players" },
  { label: "PRODUCTS", path: "/products" },
  { label: "PARTNERS", path: "/partners" },
  { label: "PARTNER WITH US", path: "/partner-with-us" },
  { label: "MEDIA", path: "/media" },
  { label: "NEWS", path: "/news" },
  { label: "ABOUT", path: "/about" },
  { label: "COMMUNITY", path: "/community" },
];

export const Navbar = () => {
  const { isScrolled } = useScrollPosition(30);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { openJoinTournament, openLogin } = useModals();
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[7000] transition-all duration-300 ${
          isScrolled
            ? "bg-[#070708]/95 backdrop-blur-md border-b border-[#FFBE32]/25 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-[#050505]/80 backdrop-blur-sm border-b border-white/5 py-3.5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="relative">
              <img
                src={logoImg}
                alt="Lordz Esports"
                className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,190,50,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-xl xl:text-2xl leading-none uppercase tracking-widest text-white">
                LORDZ <span className="text-[#FFBE32]">ESPORTS</span>
              </span>
              <span className="font-heading text-[8px] sm:text-[9px] tracking-[0.25em] text-[#9CA3AF] uppercase">
                India's Elite Clan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Straight Row Layout (No dropdown) */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 2xl:gap-5 text-[11px] xl:text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
            {straightNavItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative py-1 transition-colors hover:text-[#FFBE32] whitespace-nowrap ${
                    isActive ? "text-[#FFBE32] font-extrabold" : "text-gray-300"
                  } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFBE32] ${
                    isActive ? "after:scale-x-100" : "after:scale-x-0"
                  } hover:after:scale-x-100 after:transition-transform after:origin-center`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {isAuthenticated && user ? (
              <button
                onClick={openLogin}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl border border-[#FFBE32]/40 bg-[#FFBE32]/10 hover:bg-[#FFBE32]/20 transition-all cursor-pointer group shadow-[0_0_15px_rgba(255,190,50,0.15)]"
                title="Open Athlete Passport & Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FFBE32] text-black font-display text-[11px] font-bold flex items-center justify-center">
                  {user.ign?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase() || "LZ"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-white group-hover:text-[#FFBE32] leading-none">
                    {user.ign || user.username}
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-[#FFBE32] leading-tight flex items-center gap-0.5">
                    <ShieldCheck className="h-2.5 w-2.5 text-[#22C55E]" /> ATHLETE
                  </span>
                </div>
              </button>
            ) : (
              <OutlineButton
                onClick={openLogin}
                className="py-2 px-3 sm:px-4 text-[11px] font-heading font-bold"
              >
                LOGIN
              </OutlineButton>
            )}
            <GoldButton
              onClick={() => openJoinTournament()}
              className="py-2 px-3 sm:px-4 text-[11px] font-heading font-bold"
              showArrow={false}
            >
              JOIN TOURNAMENT
            </GoldButton>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 text-white hover:text-[#FFBE32] transition-colors focus:outline-none cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenJoin={() => {
          setMobileMenuOpen(false);
          openJoinTournament();
        }}
        onOpenLogin={() => {
          setMobileMenuOpen(false);
          openLogin();
        }}
        currentPath={pathname}
      />
    </>
  );
};
