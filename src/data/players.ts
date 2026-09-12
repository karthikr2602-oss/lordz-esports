export interface Player {
  id: string;
  ign: string;
  realName: string;
  jerseyNumber: string;
  role: "IGL" | "RUSHER" | "SNIPER" | "SUPPORT" | "FRAGGER";
  game: string;
  team: string;
  kdRatio: string;
  headshotRate: string;
  matchesPlayed: number;
  featuredQuote: string;
  avatarBg: string;
  isCaptain?: boolean;
}

export const playersData: Player[] = [
  {
    id: "player-beast",
    ign: "BEAST",
    realName: "Akash Sharma",
    jerseyNumber: "00",
    role: "IGL",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    kdRatio: "4.82",
    headshotRate: "68%",
    matchesPlayed: 142,
    featuredQuote: "Tactics win rounds. Pure conviction wins championships.",
    avatarBg: "from-amber-500/20 via-yellow-600/10 to-transparent",
    isCaptain: true,
  },
  {
    id: "player-shadow",
    ign: "SHADOW",
    realName: "Vikram Raman",
    jerseyNumber: "07",
    role: "RUSHER",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    kdRatio: "5.15",
    headshotRate: "72%",
    matchesPlayed: 128,
    featuredQuote: "First through the smoke, last man standing.",
    avatarBg: "from-yellow-500/20 via-neutral-800 to-transparent",
  },
  {
    id: "player-falcon",
    ign: "FALCON",
    realName: "Karthik Raja",
    jerseyNumber: "21",
    role: "SNIPER",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    kdRatio: "4.40",
    headshotRate: "81%",
    matchesPlayed: 115,
    featuredQuote: "One bullet, one territory secured.",
    avatarBg: "from-amber-600/20 via-neutral-900 to-transparent",
  },
  {
    id: "player-viper",
    ign: "VIPER",
    realName: "Dinesh Kumar",
    jerseyNumber: "99",
    role: "SUPPORT",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    kdRatio: "3.95",
    headshotRate: "59%",
    matchesPlayed: 134,
    featuredQuote: "Covering the angles that secure the crown.",
    avatarBg: "from-yellow-600/20 via-neutral-800 to-transparent",
  },
];
