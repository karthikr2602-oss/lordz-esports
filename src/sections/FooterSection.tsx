import logoImg from "../assets/lordz-logo.png";
import { ArrowUp, Mail, MapPin } from "lucide-react";

interface FooterSectionProps {
  onOpenJoin: () => void;
  onOpenLogin: () => void;
  onOpenShop: () => void;
}

export const FooterSection = ({
  onOpenJoin,
  onOpenLogin,
  onOpenShop,
}: FooterSectionProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-[#FFBE32]/20 pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Bottom Gold Radiance */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#FFBE32]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-flex items-center gap-3">
              <img
                src={logoImg}
                alt="Lordz Esports"
                className="h-12 w-12 object-contain drop-shadow-[0_0_15px_rgba(255,190,50,0.35)]"
              />
              <div className="flex flex-col">
                <span className="font-display text-3xl uppercase tracking-widest text-white">
                  LORDZ <span className="text-[#FFBE32]">ESPORTS</span>
                </span>
                <span className="font-heading text-[10px] tracking-[0.25em] text-[#9CA3AF] uppercase">
                  Indian Competitive Gaming
                </span>
              </div>
            </a>

            <p className="mt-4 text-sm text-[#9CA3AF] font-body leading-relaxed max-w-sm">
              "Compete. Improve. Build your legacy." Lordz Esports is a premier Indian esports organization and gaming platform empowering tournament rosters, daily scrims, and national championship athletes.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 font-body">
              <MapPin className="h-4 w-4 text-[#FFBE32]" />
              <span>Chennai, Tamil Nadu • Pan-India Circuit</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 font-body">
              <Mail className="h-4 w-4 text-[#FFBE32]" />
              <span>contact@lordzesports.gg</span>
            </div>
          </div>

          {/* Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#FFBE32] mb-4">
              ARENA
            </h4>
            <ul className="space-y-2.5 text-xs font-heading tracking-wider uppercase text-gray-400">
              <li>
                <a href="#tournaments" className="hover:text-white transition-colors">
                  Tournaments
                </a>
              </li>
              <li>
                <a href="#tournaments" className="hover:text-white transition-colors">
                  Tier-1 Scrims
                </a>
              </li>
              <li>
                <a href="#flame-of-glory" className="hover:text-white transition-colors">
                  Flame of Glory
                </a>
              </li>
              <li>
                <a href="#matches" className="hover:text-white transition-colors">
                  Match Center
                </a>
              </li>
              <li>
                <button onClick={onOpenJoin} className="hover:text-[#FFBE32] transition-colors cursor-pointer text-left">
                  Slot Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Organization (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#FFBE32] mb-4">
              ORGANIZATION
            </h4>
            <ul className="space-y-2.5 text-xs font-heading tracking-wider uppercase text-gray-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Lordz
                </a>
              </li>
              <li>
                <a href="#teams" className="hover:text-white transition-colors">
                  The Battlefield
                </a>
              </li>
              <li>
                <a href="#players" className="hover:text-white transition-colors">
                  Pro Roster
                </a>
              </li>
              <li>
                <a href="#hall-of-glory" className="hover:text-white transition-colors">
                  Hall of Glory
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-white transition-colors">
                  Partnerships
                </a>
              </li>
            </ul>
          </div>

          {/* Apparel & Community (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#FFBE32] mb-4">
              COMBAT STORE & PORTAL
            </h4>
            <div className="p-4 rounded-xl bg-[#0D0D10] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-lg uppercase text-white">
                  2026 PRO JERSEY
                </span>
                <span className="text-xs font-bold text-[#FFBE32] font-mono">₹1,299</span>
              </div>
              <p className="text-xs text-gray-400 font-body mb-3">
                Black & Gold Dravidian Temple Art edition. Customized player IGN print.
              </p>
              <button
                onClick={onOpenShop}
                className="w-full py-2 rounded bg-[#FFBE32] text-black font-heading text-xs font-bold uppercase tracking-wider hover:bg-[#FFCD59] transition-all cursor-pointer"
              >
                PRE-ORDER JERSEY
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onOpenLogin}
                className="text-xs font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-[#FFBE32] transition-colors cursor-pointer"
              >
                ATHLETE PORTAL LOGIN &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-body">
          <div className="flex items-center gap-2">
            <span>© 2026 LORDZ ESPORTS. ALL RIGHTS RESERVED.</span>
            <span>•</span>
            <span className="text-gray-400">MADE FOR INDIAN ESPORTS</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-gray-300 transition-colors">
              Terms of Competition
            </a>
            <a href="#rules" onClick={(e) => e.preventDefault()} className="hover:text-gray-300 transition-colors">
              Rulebook
            </a>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#FFBE32] hover:text-[#FFCD59] font-heading font-bold uppercase tracking-wider cursor-pointer ml-4"
            >
              <span>TOP</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
