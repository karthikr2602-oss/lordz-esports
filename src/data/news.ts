export interface NewsArticle {
  id: string;
  category: "TOURNAMENT" | "TEAM" | "PLAYER" | "COMMUNITY" | "ESPORTS";
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  badgeColor: string;
  author: string;
}

export const newsData: NewsArticle[] = [
  {
    id: "news-1",
    category: "TOURNAMENT",
    title: "FLAME OF GLORY S2 GRAND FINALS COMMENCES WITH ₹50,000 AT STAKE",
    excerpt: "32 of the sharpest mobile esports squads converge in a 6-round showdown. Lordz Esports enters as the heavyweight contender.",
    date: "SEP 12, 2026",
    readTime: "3 MIN READ",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    author: "Lordz Editorial",
  },
  {
    id: "news-2",
    category: "TEAM",
    title: "OFFICIAL REVEAL: THE 2026-27 LORDZ PRO JERSEY UNVEILED",
    excerpt: "Crafted with temple gopuram gold line art and battle flame motifs, representing the warrior heritage of South Indian competitive gaming.",
    date: "SEP 10, 2026",
    readTime: "2 MIN READ",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    author: "Branding Desk",
  },
  {
    id: "news-3",
    category: "PLAYER",
    title: "BEAST NAMED IGL OF THE MONTH AFTER RECORD-BREAKING CLUTCHES",
    excerpt: "With a 4.82 K/D and unmatched late-circle tactical rotations, Beast leads Lordz Esports into the championship tier.",
    date: "SEP 05, 2026",
    readTime: "4 MIN READ",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    author: "Scouting Team",
  },
  {
    id: "news-4",
    category: "COMMUNITY",
    title: "TIER-1 DAILY SCRIMS PROGRAM PASSES 500+ VERIFIED PLAYERS",
    excerpt: "Our Discord-integrated grassroots scrim infrastructure now hosts daily lobbies with live anti-cheat and automated scoreboard logging.",
    date: "AUG 28, 2026",
    readTime: "3 MIN READ",
    badgeColor: "bg-neutral-800 text-neutral-300 border-neutral-700",
    author: "Community Lead",
  },
];
