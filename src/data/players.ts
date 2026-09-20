export interface Player {
  id: string;
  ign: string;
  realName: string;
  jerseyNumber?: string;
  role: "IGL" | "RUSHER" | "SNIPER" | "SUPPORT" | "FRAGGER";
  game: string;
  team: string;
  about: string;
  instagram: string;
  image?: string;
  avatarUrl?: string;
  featuredQuote?: string;
  kdRatio?: string;
  headshotRate?: string;
  matchesPlayed?: number;
  avatarBg?: string;
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
    about: "Master strategist and veteran In-Game Leader for Lordz Esports. Renowned for clutch circle reads and decisive rotational calls.",
    instagram: "@lordz_beast",
    image: "/players/player-beast.jpg",
    avatarUrl: "/players/player-beast.jpg",
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
    about: "Frontline assault powerhouse specializing in lightning-fast entry frags and aggressive squad wipes across major tournaments.",
    instagram: "@lordz_shadow",
    image: "/players/player-shadow.jpg",
    avatarUrl: "/players/player-shadow.jpg",
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
    about: "Deadly long-range marksman known across India for unmatched AWM accuracy and securing critical high-ground vantage angles.",
    instagram: "@lordz_falcon",
    image: "/players/player-falcon.jpg",
    avatarUrl: "/players/player-falcon.jpg",
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
    about: "The clutch tactical anchor of Lordz Esports. Expert in gloo-wall fortification, utility support, and clutch resets under fire.",
    instagram: "@lordz_viper",
    image: "/players/player-viper.jpg",
    avatarUrl: "/players/player-viper.jpg",
    featuredQuote: "Covering the angles that secure the crown.",
    avatarBg: "from-yellow-600/20 via-neutral-800 to-transparent",
  },
];
