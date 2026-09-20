export interface Tournament {
  id: string;
  slug?: string;
  title: string;
  game: string;
  gameCategory: "FREE FIRE" | "FREE FIRE MAX" | string;
  status: "DRAFT" | "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "ONGOING" | "COMPLETED" | "CANCELLED" | "ARCHIVED" | "UPCOMING" | "LIVE" | string;
  prizePool: string;
  firstPrize?: string | null;
  secondPrize?: string | null;
  thirdPrize?: string | null;
  entryFee: string;
  feeAmount?: number;
  currency?: string;
  slots: string;
  totalTeams: number;
  registeredTeams: number;
  teamSize?: number;
  maxPlayersPerTeam?: number;
  substituteCount?: number;
  date: string;
  startDate?: string | null;
  endDate?: string | null;
  regStartDate?: string | null;
  regEndDate?: string | null;
  format: string;
  featured?: boolean;
  tagline: string;
  shortDescription?: string | null;
  description?: string | null;
  streamUrl?: string | null;
  bannerImage?: string | null;
  logoImage?: string | null;
  rules?: string | null;
  termsConditions?: string | null;
  upiId?: string | null;
  upiQrImage?: string | null;
  bankDetails?: string | null;
  stagesCount?: number;
  stages?: TournamentStage[];
  registrations?: RegistrationItem[];
  leaderboard?: LeaderboardEntry[];
  stats?: {
    total: number;
    approved: number;
    pending: number;
    paymentPending: number;
    paymentVerified: number;
    rejected: number;
  };
}

export interface TournamentStage {
  id: string;
  tournamentId: string;
  name: string;
  order: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | string;
  startDate?: string | null;
  endDate?: string | null;
  teamsCount?: number | null;
  currentTeamsCount?: number;
  qualificationCriteria?: string | null;
  teams?: Array<{
    id: string;
    teamName: string;
    captainIgn: string;
    status: string;
    paymentStatus: string;
  }>;
}

export interface RegistrationPlayer {
  id: string;
  name: string;
  ign: string;
  playerId?: string | null;
  role: string;
  phone?: string | null;
  email?: string | null;
  discordId?: string | null;
  isCaptain: boolean;
  isSubstitute: boolean;
}

export interface PaymentRecord {
  id: string;
  registrationId: string;
  amount: number;
  method: string;
  utr?: string | null;
  payerName?: string | null;
  screenshot?: string | null;
  status: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED" | "REFUNDED" | string;
  remarks?: string | null;
  submittedAt?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  adminNotes?: string | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy?: string | null;
  details?: string | null;
  createdAt: string;
}

export interface RegistrationItem {
  id: string;
  registrationNumber?: string;
  tournamentId: string;
  teamName: string;
  teamLogo?: string | null;
  captainIgn: string;
  captainName?: string | null;
  captainPhone?: string | null;
  captainEmail?: string | null;
  whatsapp: string;
  discordTag?: string | null;
  playerNames?: string | null;
  status: "PENDING" | "PAYMENT_PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "WAITLISTED" | "DISQUALIFIED" | string;
  paymentStatus: "PENDING" | "SUBMITTED" | "VERIFIED" | "REJECTED" | "REFUNDED" | string;
  currentStageId?: string | null;
  currentStage?: { id: string; name: string; order: number } | null;
  slotNumber?: number | null;
  adminNotes?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  players?: RegistrationPlayer[];
  payment?: PaymentRecord | null;
  activityLogs?: ActivityLog[];
  tournament?: {
    id: string;
    title: string;
    game: string;
    prizePool: string;
    status: string;
  } | null;
}

export interface LeaderboardEntry {
  id: string;
  tournamentId: string;
  teamName: string;
  tag?: string | null;
  rank: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  kills: number;
  placementPoints: number;
  bonusPoints: number;
  totalPoints: number;
  status: string;
  updatedAt?: string;
}

export const tournamentsData: Tournament[] = [
  {
    id: "fog-season-2",
    slug: "fog-season-2",
    title: "FLAME OF GLORY - FINALS",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX",
    status: "REGISTRATION_OPEN",
    prizePool: "₹50,000",
    firstPrize: "₹30,000",
    secondPrize: "₹15,000",
    thirdPrize: "₹5,000",
    entryFee: "FREE PRE-ENTRY",
    feeAmount: 0,
    currency: "INR",
    slots: "128 TEAMS",
    totalTeams: 128,
    registeredTeams: 127,
    teamSize: 4,
    maxPlayersPerTeam: 5,
    substituteCount: 1,
    date: "SEP 28, 2026 • 6:00 PM IST",
    startDate: "2026-09-28T18:00:00Z",
    endDate: "2026-09-30T22:00:00Z",
    regStartDate: "2026-09-10T00:00:00Z",
    regEndDate: "2026-09-26T23:59:59Z",
    format: "Group Stage + Knockout",
    featured: true,
    tagline: "The pinnacle championship of South Indian esports supremacy.",
    shortDescription: "India's top tier Free Fire MAX squads battling across Bermuda and Purgatory for the prestigious championship crown.",
    description: "Flame of Glory Finals Season 2 brings together 128 vetted competitive squads. Featuring multi-stage qualifiers from Round 1 through Quarter Finals, Semi Finals, and the legendary Grand Finals broadcasted live.",
    streamUrl: "https://www.youtube.com",
    bannerImage: "/uploads/partner-freefire.png",
    rules: "1. Emulators strictly banned.\n2. In-game anti-cheat recordings must be kept for 24h.\n3. Squads must check in on Discord 30 mins before match start.\n4. Minimum level 40 Free Fire account required.",
    termsConditions: "Registration fees are strictly non-refundable once slots are locked. Decisions by Lordz Tournament Marshals are final.",
    upiId: "lordzesports@upi",
    upiQrImage: "/uploads/partner-ewc.png",
    stagesCount: 4,
    stats: {
      total: 127,
      approved: 102,
      pending: 15,
      paymentPending: 5,
      paymentVerified: 107,
      rejected: 5,
    },
  },
  {
    id: "lordz-clutch-cup",
    slug: "lordz-clutch-cup",
    title: "LORDZ CLUTCH CUP S1",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX",
    status: "REGISTRATION_OPEN",
    prizePool: "₹1,00,000",
    firstPrize: "₹60,000",
    secondPrize: "₹30,000",
    thirdPrize: "₹10,000",
    entryFee: "FREE PRE-ENTRY",
    feeAmount: 0,
    currency: "INR",
    slots: "64 TEAMS",
    totalTeams: 64,
    registeredTeams: 48,
    teamSize: 4,
    maxPlayersPerTeam: 5,
    substituteCount: 1,
    date: "OCT 05, 2026 • 5:00 PM IST",
    startDate: "2026-10-05T17:00:00Z",
    endDate: "2026-10-08T22:00:00Z",
    regStartDate: "2026-09-15T00:00:00Z",
    regEndDate: "2026-10-03T23:59:59Z",
    format: "Double Elimination",
    featured: true,
    tagline: "India's fiercest mobile Free Fire squads clash for the crown.",
    shortDescription: "High-octane national tournament featuring premier tier-1 invited clans and open qualifier champions.",
    description: "64 squads battle in hardcore bracket stages with verified live anti-cheat observer review.",
    streamUrl: "https://www.youtube.com",
    bannerImage: "/uploads/partner-esportspro.png",
    rules: "Default competitive Free Fire MAX esports rulebook applies.",
    termsConditions: "All players must be present on official voice channels during matches.",
    upiId: "lordzesports@upi",
    stagesCount: 2,
    stats: {
      total: 48,
      approved: 42,
      pending: 6,
      paymentPending: 0,
      paymentVerified: 48,
      rejected: 0,
    },
  },
  {
    id: "tamil-nadu-clash",
    slug: "tamil-nadu-clash",
    title: "TAMIL NADU INVITATIONAL",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX",
    status: "UPCOMING",
    prizePool: "₹35,000",
    firstPrize: "₹20,000",
    secondPrize: "₹10,000",
    thirdPrize: "₹5,000",
    entryFee: "INVITE ONLY",
    feeAmount: 0,
    currency: "INR",
    slots: "18 TEAMS",
    totalTeams: 18,
    registeredTeams: 16,
    teamSize: 4,
    maxPlayersPerTeam: 5,
    substituteCount: 1,
    date: "OCT 12, 2026 • 7:00 PM IST",
    format: "BERMUDA MASTERS",
    featured: false,
    tagline: "Elite regional showdown organized directly by Lordz.",
    streamUrl: "https://www.youtube.com",
    bannerImage: "/uploads/partner-fusion.png",
    stagesCount: 1,
  },
];
