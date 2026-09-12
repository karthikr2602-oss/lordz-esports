import { useState } from "react";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import { Menu } from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { MobileMenu } from "./MobileMenu";

interface NavbarProps {
  onOpenJoin: () => void;
  onOpenLogin: () => void;
  onOpenShop: () => void;
}

const navItems = [
  { label: "HOME", href: "#home" },
  { label: "TOURNAMENTS", href: "#tournaments" },
  { label: "SCRIMS", href: "#tournaments" },
  { label: "MATCHES", href: "#matches" },
  { label: "LEADERBOARD", href: "#flame-of-glory" },
  { label: "TEAMS", href: "#teams" },
  { label: "PLAYERS", href: "#players" },
  { label: "NEWS", href: "#news" },
  { label: "MEDIA", href: "#media" },
];

export const Navbar = ({ onOpenJoin, onOpenLogin, onOpenShop }: NavbarProps) => {
  const { isScrolled } = useScrollPosition(30);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[7000] transition-all duration-300 ${
          isScrolled
            ? "bg-[#070708]/92 backdrop-blur-md border-b border-[#FFBE32]/25 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#home"
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            <div className="relative">
              <img
                src={logoImg}
                alt="Lordz Esports"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,190,50,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl leading-none uppercase tracking-widest text-white">
                LORDZ <span className="text-[#FFBE32]">ESPORTS</span>
              </span>
              <span className="font-heading text-[10px] tracking-[0.25em] text-[#9CA3AF] uppercase">
                India's Elite Clan
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 text-xs font-heading font-bold uppercase tracking-widest text-gray-300">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative py-1 hover:text-[#FFBE32] transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFBE32] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={onOpenShop}
              className="relative py-1 text-[#FFBE32] hover:text-white transition-colors cursor-pointer"
            >
              SHOP
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <OutlineButton
              onClick={onOpenLogin}
              size="sm"
              className="hidden md:inline-flex"
            >
              LOGIN
            </OutlineButton>
            <GoldButton onClick={onOpenJoin} size="sm" showArrow={false}>
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

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenJoin={onOpenJoin}
        onOpenLogin={onOpenLogin}
        activeSection="home"
      />
    </>
  );
};
