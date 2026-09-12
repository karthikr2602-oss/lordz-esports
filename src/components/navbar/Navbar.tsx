import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import { Menu, ChevronDown } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { MobileMenu } from "./MobileMenu";
import { useModals } from "../../context/useModals";

// Primary Desktop Nav Items
const primaryNavItems = [
  { label: "HOME", path: "/" },
  { label: "TOURNAMENTS", path: "/tournaments" },
  { label: "FLAME OF GLORY", path: "/flame-of-glory" },
  { label: "MATCHES", path: "/matches" },
  { label: "TEAMS", path: "/teams" },
  { label: "PLAYERS", path: "/players" },
  { label: "JERSEY", path: "/jersey" },
  { label: "MEDIA", path: "/media" },
];

// Secondary dropdown items
const moreNavItems = [
  { label: "NEWS", path: "/news" },
  { label: "HALL OF GLORY", path: "/hall-of-glory" },
  { label: "ABOUT LORDZ", path: "/about" },
  { label: "COMMUNITY", path: "/community" },
  { label: "PARTNERS", path: "/partners" },
];

export const Navbar = () => {
  const { isScrolled } = useScrollPosition(30);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { openJoinTournament, openLogin } = useModals();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMoreActive = moreNavItems.some((item) => item.path === pathname);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[7000] transition-all duration-300 ${
          isScrolled
            ? "bg-[#070708]/95 backdrop-blur-md border-b border-[#FFBE32]/25 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-[#050505]/75 backdrop-blur-sm border-b border-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            <div className="relative">
              <img
                src={logoImg}
                alt="Lordz Esports"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,190,50,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl leading-none uppercase tracking-widest text-white">
                LORDZ <span className="text-[#FFBE32]">ESPORTS</span>
              </span>
              <span className="font-heading text-[9px] sm:text-[10px] tracking-[0.25em] text-[#9CA3AF] uppercase">
                India's Elite Clan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-5 text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
            {primaryNavItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative py-1 transition-colors hover:text-[#FFBE32] ${
                    isActive ? "text-[#FFBE32] font-extrabold" : "text-gray-300"
                  } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFBE32] ${
                    isActive ? "after:scale-x-100" : "after:scale-x-0"
                  } hover:after:scale-x-100 after:transition-transform after:origin-center`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* MORE Dropdown for Organization, News, About, Community, Partners */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                className={`relative py-1 inline-flex items-center gap-1 transition-colors hover:text-[#FFBE32] cursor-pointer ${
                  isMoreActive ? "text-[#FFBE32] font-extrabold" : "text-gray-300"
                } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFBE32] ${
                  isMoreActive ? "after:scale-x-100" : "after:scale-x-0"
                } hover:after:scale-x-100 after:transition-transform after:origin-center`}
              >
                <span>MORE</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    moreDropdownOpen ? "rotate-180 text-[#FFBE32]" : ""
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0C0C0F] border border-[#FFBE32]/35 p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(255,190,50,0.15)] z-[7100] backdrop-blur-xl">
                  {moreNavItems.map((item) => {
                    const isItemActive = pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                          isItemActive
                            ? "text-[#FFBE32] bg-[#FFBE32]/10"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <OutlineButton
              onClick={openLogin}
              size="sm"
              className="hidden md:inline-flex"
            >
              LOGIN
            </OutlineButton>
            <GoldButton onClick={() => openJoinTournament()} size="sm" showArrow={false}>
              JOIN TOURNAMENT
            </GoldButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="xl:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="h-6 w-6 text-[#FFBE32]" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenJoin={() => openJoinTournament()}
        onOpenLogin={openLogin}
        currentPath={pathname}
      />
    </>
  );
};
