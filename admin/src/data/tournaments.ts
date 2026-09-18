export interface Tournament {
  id: string;
  title: string;
  game: string;
  gameCategory: "FREE FIRE" | "FREE FIRE MAX" | "BGMI" | "VALORANT" | "OTHER";
  status: "LIVE" | "UPCOMING" | "COMPLETED";
  prizePool: string;
  entryFee: string;
  slots: string;
  date: string;
  format: string;
  featured?: boolean;
  tagline: string;
  streamUrl?: string;
  registeredTeams: number;
  totalTeams: number;
}

export const tournamentsData: Tournament[] = [
  {
    id: "fog-season-2",
    title: "FLAME OF GLORY - FINALS",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX",
    status: "LIVE",
    prizePool: "₹50,000",
    entryFee: "FREE ENTRY",
    slots: "32 TEAMS",
    date: "LIVE TODAY • 6:00 PM IST",
    format: "BATTLE ROYALE • 6 MATCHES",
    featured: true,
    tagline: "The pinnacle championship of South Indian esports supremacy.",
    streamUrl: "https://www.youtube.com",
    registeredTeams: 32,
    totalTeams: 32,
  },
  {
    id: "lordz-clutch-cup",
    title: "LORDZ CLUTCH CUP S1",
    game: "BGMI",
    gameCategory: "BGMI",
    status: "UPCOMING",
    prizePool: "₹1,00,000",
    entryFee: "₹250 / SQUAD",
    slots: "64 TEAMS",
    date: "SEP 20, 2026 • 5:00 PM IST",
    format: "ERANGEL & MIRAMAR • HARDCORE",
    featured: true,
    tagline: "India's fiercest mobile warriors clash for the crown.",
    registeredTeams: 48,
    totalTeams: 64,
  },
  {
    id: "tamil-nadu-clash",
    title: "TAMIL NADU INVITATIONAL",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX",
    status: "UPCOMING",
    prizePool: "₹35,000",
    entryFee: "INVITE ONLY",
    slots: "18 TEAMS",
    date: "SEP 25, 2026 • 7:00 PM IST",
    format: "BERMUDA MASTERS",
    featured: false,
    tagline: "Elite regional showdown organized directly by Lordz.",
    registeredTeams: 16,
    totalTeams: 18,
  },
  {
    id: "val-ignite-series",
    title: "IGNITE PROTOCOL 2026",
    game: "VALORANT",
    gameCategory: "VALORANT",
    status: "UPCOMING",
    prizePool: "₹75,000",
    entryFee: "FREE ENTRY",
    slots: "32 TEAMS",
    date: "OCT 02, 2026 • 4:00 PM IST",
    format: "5v5 DOUBLE ELIMINATION",
    featured: false,
    tagline: "Tactical FPS championship for emerging Indian rosters.",
    registeredTeams: 22,
    totalTeams: 32,
  },
  {
    id: "daily-grind-scrims",
    title: "LORDZ DAILY TIER-1 SCRIMS",
    game: "FREE FIRE",
    gameCategory: "FREE FIRE",
    status: "LIVE",
    prizePool: "₹5,000 DAILY",
    entryFee: "FREE VERIFIED",
    slots: "12 TEAMS",
    date: "EVERYDAY • 8:00 PM IST",
    format: "TIER 1 PRO SCRIMS",
    featured: false,
    tagline: "High-cadence tournament preparation against vetted top squads.",
    registeredTeams: 12,
    totalTeams: 12,
  },
  {
    id: "fog-season-1",
    title: "FLAME OF GLORY S1",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX",
    status: "COMPLETED",
    prizePool: "₹25,000",
    entryFee: "COMPLETED",
    slots: "24 TEAMS",
    date: "AUGUST 2026",
    format: "CHAMPIONSHIP FINALS",
    featured: false,
    tagline: "Season 1 concluded with Lordz Esports podium triumph.",
    registeredTeams: 24,
    totalTeams: 24,
  },
  {
    id: "india-showdown-bgmi",
    title: "SHOWDOWN INVITATIONAL",
    game: "BGMI",
    gameCategory: "BGMI",
    status: "COMPLETED",
    prizePool: "₹50,000",
    entryFee: "COMPLETED",
    slots: "32 TEAMS",
    date: "JULY 2026",
    format: "CUSTOM LOBBY FINALS",
    featured: false,
    tagline: "Top tier Indian squads competed in 3-day showdown.",
    registeredTeams: 32,
    totalTeams: 32,
  },
];
