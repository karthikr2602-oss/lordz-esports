import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

// ================= VALIDATION SCHEMAS =================

const tournamentSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional().nullable(),
  game: z.string().default("FREE FIRE MAX"),
  gameCategory: z.string().default("FREE FIRE MAX"),
  gameMode: z.string().default("SQUAD BATTLE ROYALE"),
  status: z.enum([
    "DRAFT",
    "REGISTRATION_OPEN",
    "CLOSING_SOON",
    "FULL",
    "REGISTRATION_CLOSED",
    "ONGOING",
    "COMPLETED",
    "CANCELLED",
    "ARCHIVED",
    "UPCOMING",
    "LIVE",
  ]).default("REGISTRATION_OPEN"),
  prizePool: z.string().default("₹50,000"),
  firstPrize: z.string().optional().nullable(),
  secondPrize: z.string().optional().nullable(),
  thirdPrize: z.string().optional().nullable(),
  entryFee: z.string().default("FREE ENTRY"),
  feeAmount: z.number().default(0),
  currency: z.string().default("INR"),
  slots: z.string().default("32 TEAMS"),
  totalTeams: z.number().default(32),
  teamSize: z.number().default(4),
  maxPlayersPerTeam: z.number().default(5),
  substituteCount: z.number().default(1),
  date: z.string(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  startTime: z.string().optional().default("18:00 IST"),
  regStartDate: z.string().optional().nullable(),
  regEndDate: z.string().optional().nullable(),
  regDeadline: z.any().optional().nullable(),
  rosterLockDate: z.any().optional().nullable(),
  allowMultipleTeams: z.boolean().optional().default(false),
  requireTeammateApproval: z.boolean().optional().default(true),
  slotReservationDuration: z.number().optional().default(10),
  format: z.string().default("BATTLE ROYALE • 6 MATCHES"),
  matchFormat: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  tagline: z.string().default("Official Lord Esports Tournament"),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  streamUrl: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  logoImage: z.string().optional().nullable(),
  rules: z.string().optional().nullable(),
  scoringRules: z.string().optional().nullable(),
  termsConditions: z.string().optional().nullable(),
  contactInfo: z.string().optional().nullable(),
  upiId: z.string().optional().nullable(),
  upiQrImage: z.string().optional().nullable(),
  bankDetails: z.string().optional().nullable(),
});

const playerSchema = z.object({
  name: z.string().optional().nullable().default("Player"),
  ign: z.string().min(1, "Player IGN is required"),
  playerId: z.string().optional().nullable(),
  role: z.string().default("STARTER"),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  discordId: z.string().optional().nullable(),
  isCaptain: z.boolean().default(false),
  isSubstitute: z.boolean().default(false),
});

const registrationSchema = z.object({
  teamName: z.string().min(1, "Team Name is required"),
  teamLogo: z.string().optional().nullable(),
  captainIgn: z.string().min(1, "Captain IGN is required"),
  captainName: z.string().optional().nullable(),
  captainPhone: z.string().optional().nullable(),
  captainEmail: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable().default(""),
  discordTag: z.string().optional().nullable(),
  playerNames: z.string().optional().nullable(),
  players: z.array(playerSchema).optional().default([]),
  payment: z.object({
    amount: z.number().optional().default(0),
    method: z.string().optional().default("UPI"),
    utr: z.string().optional().nullable(),
    payerName: z.string().optional().nullable(),
    screenshot: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
  }).optional().nullable(),
});

const stageSchema = z.object({
  name: z.string().min(2),
  order: z.number().default(1),
  status: z.string().default("UPCOMING"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  teamsCount: z.number().optional().nullable(),
  qualificationCriteria: z.string().optional().nullable(),
});

// Helper to safely execute Prisma calls with in-memory fallback
let dbConnected = false;
prisma.$connect()
  .then(() => { dbConnected = true; })
  .catch(() => { dbConnected = false; });

// ================= IN-MEMORY RESILIENT STORE =================
// Initialized with standard Lordz tournament data to ensure offline/mock stability
let memoryTournaments: any[] = [
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
    registeredTeams: 4,
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
    logoImage: null,
    rules: "1. Emulators strictly banned.\n2. In-game anti-cheat recordings must be kept for 24h.\n3. Squads must check in on Discord 30 mins before match start.\n4. Minimum level 40 Free Fire account required.",
    termsConditions: "Registration fees are strictly non-refundable once slots are locked. Decisions by Lordz Tournament Marshals are final.",
    upiId: "lordzesports@upi",
    upiQrImage: "/uploads/partner-ewc.png",
    bankDetails: null,
    createdAt: new Date("2026-09-01T10:00:00Z"),
    updatedAt: new Date(),
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
    registeredTeams: 2,
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
    logoImage: null,
    rules: "Default competitive Free Fire MAX esports rulebook applies.",
    termsConditions: "All players must be present on official voice channels during matches.",
    upiId: "lordzesports@upi",
    upiQrImage: null,
    bankDetails: null,
    createdAt: new Date("2026-09-05T10:00:00Z"),
    updatedAt: new Date(),
  },
];

let memoryStages: any[] = [
  {
    id: "stage-fog-1",
    tournamentId: "fog-season-2",
    name: "ROUND 1",
    order: 1,
    status: "ONGOING",
    startDate: "2026-09-28",
    endDate: "2026-09-28",
    teamsCount: 128,
    qualificationCriteria: "Top 4 from each group advance to Round 2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "stage-fog-2",
    tournamentId: "fog-season-2",
    name: "ROUND 2",
    order: 2,
    status: "UPCOMING",
    startDate: "2026-09-29",
    endDate: "2026-09-29",
    teamsCount: 64,
    qualificationCriteria: "Top 2 from each lobby advance to Quarter Finals",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "stage-fog-3",
    tournamentId: "fog-season-2",
    name: "QUARTER FINALS",
    order: 3,
    status: "UPCOMING",
    startDate: "2026-09-29",
    endDate: "2026-09-29",
    teamsCount: 32,
    qualificationCriteria: "Top 16 squads qualify for Semi Finals",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "stage-fog-4",
    tournamentId: "fog-season-2",
    name: "GRAND FINALS",
    order: 4,
    status: "UPCOMING",
    startDate: "2026-09-30",
    endDate: "2026-09-30",
    teamsCount: 12,
    qualificationCriteria: "6 matches cumulative points table",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Clutch Cup default stages
  {
    id: "stage-clutch-1",
    tournamentId: "lordz-clutch-cup",
    name: "QUALIFIERS",
    order: 1,
    status: "UPCOMING",
    teamsCount: 64,
    qualificationCriteria: "Top 16 advance",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "stage-clutch-2",
    tournamentId: "lordz-clutch-cup",
    name: "GRAND FINALS",
    order: 2,
    status: "UPCOMING",
    teamsCount: 16,
    qualificationCriteria: "Championship matches",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let memoryRegistrations: any[] = [
  {
    id: "reg-dfg-01",
    registrationNumber: "LZ-FGF-00127",
    tournamentId: "fog-season-2",
    teamName: "DFG ESPORTS",
    teamLogo: null,
    captainIgn: "DFG_MAHESH",
    captainName: "Mahesh Kumar",
    captainPhone: "+91 99000 88776",
    captainEmail: "mahesh@dfgesports.com",
    whatsapp: "+91 99000 88776",
    discordTag: "dfg_lead#0001",
    playerNames: "DFG_MAHESH, PLAYER_02, PLAYER_03, PLAYER_04, PLAYER_05",
    status: "APPROVED",
    paymentStatus: "VERIFIED",
    currentStageId: "stage-fog-1",
    slotNumber: 1,
    adminNotes: "Vetted Tier-1 Squad from regional league",
    approvedAt: new Date("2026-09-18T11:05:00Z"),
    rejectedAt: null,
    createdAt: new Date("2026-09-18T10:32:00Z"),
    updatedAt: new Date("2026-09-18T11:05:00Z"),
    players: [
      { id: "p-1", name: "Mahesh Kumar", ign: "DFG_MAHESH", playerId: "109827364", role: "IGL", phone: "+91 99000 88776", email: "mahesh@dfg.gg", discordId: "dfg_lead#0001", isCaptain: true, isSubstitute: false },
      { id: "p-2", name: "Arun", ign: "PLAYER_02", playerId: "298716253", role: "Rusher", phone: "+91 99000 88777", email: null, discordId: "arun#1029", isCaptain: false, isSubstitute: false },
      { id: "p-3", name: "Karthik", ign: "PLAYER_03", playerId: "387461928", role: "Support", phone: "+91 99000 88778", email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-4", name: "Rahul", ign: "PLAYER_04", playerId: "476592817", role: "Sniper", phone: "+91 99000 88779", email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-5", name: "Vishal", ign: "PLAYER_05", playerId: "587162839", role: "Entry", phone: "+91 99000 88780", email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-6", name: "Suresh", ign: "PLAYER_06", playerId: "687291029", role: "Sub", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: true },
    ],
    payment: {
      id: "pay-1",
      registrationId: "reg-dfg-01",
      amount: 499,
      method: "UPI",
      utr: "324567891234",
      payerName: "Mahesh Kumar",
      screenshot: "/uploads/partner-infinix.png",
      status: "VERIFIED",
      remarks: "Transaction verified on HDFC UPI gateway",
      submittedAt: new Date("2026-09-18T10:35:00Z"),
      verifiedAt: new Date("2026-09-18T11:02:00Z"),
      verifiedBy: "admin@lordz.gg",
      adminNotes: "UTR verified with merchant passbook",
    },
    activityLogs: [
      { id: "log-1", action: "REGISTRATION_SUBMITTED", performedBy: "Mahesh Kumar", details: "Registration submitted for FLAME OF GLORY - FINALS", createdAt: new Date("2026-09-18T10:32:00Z") },
      { id: "log-2", action: "PAYMENT_SUBMITTED", performedBy: "Mahesh Kumar", details: "Payment of ₹499 submitted (UTR: 324567891234)", createdAt: new Date("2026-09-18T10:35:00Z") },
      { id: "log-3", action: "PAYMENT_VERIFIED", performedBy: "admin@lordz.gg", details: "Payment verified by Admin", createdAt: new Date("2026-09-18T11:02:00Z") },
      { id: "log-4", action: "REGISTRATION_APPROVED", performedBy: "admin@lordz.gg", details: "Registration approved into ROUND 1", createdAt: new Date("2026-09-18T11:05:00Z") },
    ],
  },
  {
    id: "reg-godlike-02",
    registrationNumber: "LZ-FGF-00128",
    tournamentId: "fog-season-2",
    teamName: "GODLIKE CLAN",
    teamLogo: null,
    captainIgn: "JONATHAN_X",
    captainName: "Jonathan Amaral",
    captainPhone: "+91 98450 11223",
    captainEmail: "jonathan@godlike.in",
    whatsapp: "+91 98450 11223",
    discordTag: "jonathan#9988",
    playerNames: "JONATHAN_X, SHADOW_G, CLUTCH_GOD, NEYOOO",
    status: "APPROVED",
    paymentStatus: "VERIFIED",
    currentStageId: "stage-fog-1",
    slotNumber: 2,
    adminNotes: "Direct invite slot",
    approvedAt: new Date("2026-09-18T12:00:00Z"),
    rejectedAt: null,
    createdAt: new Date("2026-09-18T11:30:00Z"),
    updatedAt: new Date("2026-09-18T12:00:00Z"),
    players: [
      { id: "p-21", name: "Jonathan", ign: "JONATHAN_X", playerId: "778899001", role: "IGL", phone: "+91 98450 11223", email: null, discordId: "jonathan#9988", isCaptain: true, isSubstitute: false },
      { id: "p-22", name: "Shadow", ign: "SHADOW_G", playerId: "778899002", role: "Rusher", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-23", name: "ClutchGod", ign: "CLUTCH_GOD", playerId: "778899003", role: "Support", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-24", name: "Neyo", ign: "NEYOOO", playerId: "778899004", role: "Sniper", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
    ],
    payment: {
      id: "pay-2",
      registrationId: "reg-godlike-02",
      amount: 499,
      method: "UPI",
      utr: "982736451029",
      payerName: "Jonathan",
      screenshot: "/uploads/partner-fusion.png",
      status: "VERIFIED",
      remarks: "Verified by admin",
      submittedAt: new Date("2026-09-18T11:35:00Z"),
      verifiedAt: new Date("2026-09-18T12:00:00Z"),
      verifiedBy: "admin@lordz.gg",
      adminNotes: "Approved",
    },
    activityLogs: [
      { id: "log-21", action: "REGISTRATION_SUBMITTED", performedBy: "Jonathan", details: "Registration submitted", createdAt: new Date("2026-09-18T11:30:00Z") },
      { id: "log-22", action: "PAYMENT_VERIFIED", performedBy: "admin@lordz.gg", details: "Payment verified", createdAt: new Date("2026-09-18T12:00:00Z") },
      { id: "log-23", action: "REGISTRATION_APPROVED", performedBy: "admin@lordz.gg", details: "Registration approved", createdAt: new Date("2026-09-18T12:00:00Z") },
    ],
  },
  {
    id: "reg-veera-03",
    registrationNumber: "LZ-FGF-00129",
    tournamentId: "fog-season-2",
    teamName: "VEERA TAMIZHAN",
    teamLogo: null,
    captainIgn: "TAMIL_HUNTER",
    captainName: "Saravanan",
    captainPhone: "+91 97890 55443",
    captainEmail: "hunter@veera.gg",
    whatsapp: "+91 97890 55443",
    discordTag: "hunter#4433",
    playerNames: "TAMIL_HUNTER, VELU_99, MARUTHU, SINGAM_T",
    status: "PENDING",
    paymentStatus: "SUBMITTED",
    currentStageId: "stage-fog-1",
    slotNumber: null,
    adminNotes: "UTR submitted, awaiting manual verification",
    approvedAt: null,
    rejectedAt: null,
    createdAt: new Date("2026-09-19T08:15:00Z"),
    updatedAt: new Date("2026-09-19T08:15:00Z"),
    players: [
      { id: "p-31", name: "Saravanan", ign: "TAMIL_HUNTER", playerId: "554433221", role: "IGL", phone: "+91 97890 55443", email: null, discordId: "hunter#4433", isCaptain: true, isSubstitute: false },
      { id: "p-32", name: "Velu", ign: "VELU_99", playerId: "554433222", role: "Rusher", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-33", name: "Maruthu", ign: "MARUTHU", playerId: "554433223", role: "Support", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-34", name: "Singam", ign: "SINGAM_T", playerId: "554433224", role: "Entry", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
    ],
    payment: {
      id: "pay-3",
      registrationId: "reg-veera-03",
      amount: 499,
      method: "UPI",
      utr: "449911882233",
      payerName: "Saravanan M",
      screenshot: "/uploads/partner-espotz.png",
      status: "SUBMITTED",
      remarks: "Sent via GPay to lordzesports@upi",
      submittedAt: new Date("2026-09-19T08:20:00Z"),
      verifiedAt: null,
      verifiedBy: null,
      adminNotes: null,
    },
    activityLogs: [
      { id: "log-31", action: "REGISTRATION_SUBMITTED", performedBy: "Saravanan", details: "Registration submitted", createdAt: new Date("2026-09-19T08:15:00Z") },
      { id: "log-32", action: "PAYMENT_SUBMITTED", performedBy: "Saravanan", details: "Payment submitted (UTR: 449911882233)", createdAt: new Date("2026-09-19T08:20:00Z") },
    ],
  },
  {
    id: "reg-soul-04",
    registrationNumber: "LZ-FGF-00130",
    tournamentId: "fog-season-2",
    teamName: "SOUL WARRIORS",
    teamLogo: null,
    captainIgn: "SOUL_VIPER",
    captainName: "Viper Esports",
    captainPhone: "+91 98765 43210",
    captainEmail: "viper@soul.gg",
    whatsapp: "+91 98765 43210",
    discordTag: "viper#1234",
    playerNames: "SOUL_VIPER, SOUL_AMAN, SOUL_REGALTOS, SOUL_RONAK",
    status: "PAYMENT_PENDING",
    paymentStatus: "PENDING",
    currentStageId: "stage-fog-1",
    slotNumber: null,
    adminNotes: "Awaiting UPI payment",
    approvedAt: null,
    rejectedAt: null,
    createdAt: new Date("2026-09-19T14:45:00Z"),
    updatedAt: new Date("2026-09-19T14:45:00Z"),
    players: [
      { id: "p-41", name: "Aman", ign: "SOUL_VIPER", playerId: "998877661", role: "IGL", phone: "+91 98765 43210", email: null, discordId: "viper#1234", isCaptain: true, isSubstitute: false },
      { id: "p-42", name: "Aman J", ign: "SOUL_AMAN", playerId: "998877662", role: "Rusher", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-43", name: "Regaltos", ign: "SOUL_REGALTOS", playerId: "998877663", role: "Support", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
      { id: "p-44", name: "Ronak", ign: "SOUL_RONAK", playerId: "998877664", role: "Sniper", phone: null, email: null, discordId: null, isCaptain: false, isSubstitute: false },
    ],
    payment: null,
    activityLogs: [
      { id: "log-41", action: "REGISTRATION_SUBMITTED", performedBy: "SOUL_VIPER", details: "Registration submitted, payment pending", createdAt: new Date("2026-09-19T14:45:00Z") },
    ],
  },
];

let memoryLeaderboard: any[] = [
  {
    id: "lb-1",
    tournamentId: "fog-season-2",
    teamName: "DFG ESPORTS",
    tag: "DFG",
    rank: 1,
    matchesPlayed: 5,
    wins: 4,
    losses: 1,
    kills: 32,
    placementPoints: 46,
    bonusPoints: 0,
    totalPoints: 78,
    status: "ACTIVE",
    updatedAt: new Date(),
  },
  {
    id: "lb-2",
    tournamentId: "fog-season-2",
    teamName: "GODLIKE CLAN",
    tag: "GDL",
    rank: 2,
    matchesPlayed: 5,
    wins: 3,
    losses: 2,
    kills: 28,
    placementPoints: 37,
    bonusPoints: 0,
    totalPoints: 65,
    status: "ACTIVE",
    updatedAt: new Date(),
  },
  {
    id: "lb-3",
    tournamentId: "fog-season-2",
    teamName: "LORD ESPORTS",
    tag: "LORD",
    rank: 3,
    matchesPlayed: 5,
    wins: 2,
    losses: 3,
    kills: 24,
    placementPoints: 34,
    bonusPoints: 2,
    totalPoints: 60,
    status: "ACTIVE",
    updatedAt: new Date(),
  },
  {
    id: "lb-4",
    tournamentId: "fog-season-2",
    teamName: "VEERA TAMIZHAN",
    tag: "VT",
    rank: 4,
    matchesPlayed: 5,
    wins: 1,
    losses: 4,
    kills: 19,
    placementPoints: 26,
    bonusPoints: 0,
    totalPoints: 45,
    status: "ACTIVE",
    updatedAt: new Date(),
  },
];

// Helper to compute live registration statistics for a tournament
function getTournamentStats(tournamentId: string) {
  const regs = memoryRegistrations.filter((r) => r.tournamentId === tournamentId);
  const total = regs.length;
  const approved = regs.filter((r) => r.status === "APPROVED").length;
  const pending = regs.filter((r) => r.status === "PENDING" || r.status === "UNDER_REVIEW").length;
  const paymentPending = regs.filter((r) => r.status === "PAYMENT_PENDING" || r.paymentStatus === "PENDING").length;
  const paymentVerified = regs.filter((r) => r.paymentStatus === "VERIFIED").length;
  const rejected = regs.filter((r) => r.status === "REJECTED").length;

  return {
    total,
    approved,
    pending,
    paymentPending,
    paymentVerified,
    rejected,
  };
}

// Recalculate leaderboard ranking dynamically
function recalculateLeaderboardRanks(tournamentId: string) {
  const entries = memoryLeaderboard.filter((lb) => lb.tournamentId === tournamentId);
  // Sort descending by totalPoints, then kills, then wins
  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.kills !== a.kills) return b.kills - a.kills;
    return b.wins - a.wins;
  });

  entries.forEach((item, idx) => {
    item.rank = idx + 1;
    item.updatedAt = new Date();
  });
}

// ================= CONTROLLER HANDLERS =================

/**
 * GET /api/tournaments
 * List all tournaments with dynamically computed registeredTeams count
 */
export const getTournaments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, gameCategory, featured, search } = req.query;

    if (dbConnected) {
      try {
        const where: any = {};
        if (status && status !== "ALL") where.status = String(status);
        if (gameCategory && gameCategory !== "ALL") where.gameCategory = String(gameCategory);
        if (featured !== undefined) where.featured = featured === "true";
        if (search) {
          where.OR = [
            { title: { contains: String(search), mode: "insensitive" } },
            { tagline: { contains: String(search), mode: "insensitive" } },
            { game: { contains: String(search), mode: "insensitive" } },
          ];
        }

        const tournaments = await prisma.tournament.findMany({
          where,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          include: {
            _count: {
              select: { registrations: true },
            },
            registrations: {
              select: {
                id: true,
                status: true,
                paymentStatus: true,
              },
            },
          },
        });

        const mapped = tournaments.map((t: any) => {
          const confirmedCount = (t.registrations || []).filter(
            (r: any) => r.status === "CONFIRMED" || r.status === "APPROVED"
          ).length;
          const totalSlots = t.totalTeams || 32;
          const availableSlots = Math.max(0, totalSlots - confirmedCount);

          let dynamicStatus = t.status;
          if (t.status === "CANCELLED" || t.status === "COMPLETED") {
            dynamicStatus = t.status;
          } else if (confirmedCount >= totalSlots) {
            dynamicStatus = "FULL";
          } else if ((t as any).regDeadline && new Date() > new Date((t as any).regDeadline)) {
            dynamicStatus = "REGISTRATION_CLOSED";
          } else if (
            (t as any).regDeadline &&
            new Date((t as any).regDeadline).getTime() - Date.now() < 24 * 3600 * 1000 &&
            new Date((t as any).regDeadline).getTime() > Date.now()
          ) {
            dynamicStatus = "CLOSING_SOON";
          }

          return {
            ...t,
            registeredTeams: confirmedCount,
            confirmedTeams: confirmedCount,
            availableSlots,
            status: dynamicStatus,
            stages: (t as any).stages || [],
            stagesCount: (t as any)._count?.stages || (t as any).stages?.length || 0,
          };
        });

        res.json({ success: true, data: mapped });
        return;
      } catch (err) {
        console.warn("Prisma query failed, utilizing resilient in-memory store:", err);
      }
    }

    // In-memory fallback
    let result = [...memoryTournaments];
    if (status && status !== "ALL") {
      result = result.filter((t) => t.status === status);
    }
    if (gameCategory && gameCategory !== "ALL") {
      result = result.filter((t) => t.gameCategory === gameCategory);
    }
    if (featured !== undefined) {
      result = result.filter((t) => t.featured === (featured === "true"));
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.tagline && t.tagline.toLowerCase().includes(q)) ||
          t.game.toLowerCase().includes(q)
      );
    }

    const enhanced = result.map((t) => {
      const stats = getTournamentStats(t.id);
      const stages = memoryStages.filter((s) => s.tournamentId === t.id);
      const confirmedCount = stats.approved;
      const totalSlots = t.totalTeams || 32;
      const availableSlots = Math.max(0, totalSlots - confirmedCount);

      let dynamicStatus = t.status;
      if (confirmedCount >= totalSlots) dynamicStatus = "FULL";

      return {
        ...t,
        registeredTeams: confirmedCount,
        confirmedTeams: confirmedCount,
        availableSlots,
        status: dynamicStatus,
        stagesCount: stages.length,
        stats,
      };
    });

    res.json({ success: true, data: enhanced });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tournaments/:id (or slug)
 * Fetch full tournament with stages, registrations, leaderboard & stats
 */
export const getTournamentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (dbConnected) {
      try {
        const tournament: any = await prisma.tournament.findFirst({
          where: {
            id,
          } as any,
          include: {
            registrations: {
              orderBy: { createdAt: "desc" },
            },
            matches: { orderBy: { createdAt: "desc" } },
            standings: { orderBy: { sortOrder: "asc" } },
          },
        });

        if (tournament) {
          const regs: any[] = tournament.registrations || [];
          const total = regs.length;
          const approved = regs.filter((r: any) => r.status === "CONFIRMED" || r.status === "APPROVED").length;
          const pending = regs.filter((r: any) => r.status === "PENDING" || r.status === "UNDER_REVIEW").length;
          const paymentPending = regs.filter((r: any) => r.status === "PAYMENT_PENDING" || r.paymentStatus === "PENDING").length;
          const paymentVerified = regs.filter((r: any) => r.paymentStatus === "VERIFIED").length;
          const rejected = regs.filter((r: any) => r.status === "REJECTED").length;

          const totalSlots = tournament.totalTeams || 32;
          const availableSlots = Math.max(0, totalSlots - approved);

          let dynamicStatus = tournament.status;
          if (tournament.status === "CANCELLED" || tournament.status === "COMPLETED") {
            dynamicStatus = tournament.status;
          } else if (approved >= totalSlots) {
            dynamicStatus = "FULL";
          } else if (tournament.regDeadline && new Date() > new Date(tournament.regDeadline)) {
            dynamicStatus = "REGISTRATION_CLOSED";
          } else if (
            tournament.regDeadline &&
            new Date(tournament.regDeadline).getTime() - Date.now() < 24 * 3600 * 1000 &&
            new Date(tournament.regDeadline).getTime() > Date.now()
          ) {
            dynamicStatus = "CLOSING_SOON";
          }

          res.json({
            success: true,
            data: {
              ...tournament,
              registeredTeams: approved,
              confirmedTeams: approved,
              availableSlots,
              status: dynamicStatus,
              stats: {
                total,
                approved,
                pending,
                paymentPending,
                paymentVerified,
                rejected,
              },
            },
          });
          return;
        }
      } catch (err) {
        console.warn("Prisma getById failed, checking resilient memory store:", err);
      }
    }

    // In-memory fallback
    const tournament = memoryTournaments.find((t) => t.id === id || t.slug === id);
    if (!tournament) {
      res.status(404).json({ success: false, message: "Tournament not found" });
      return;
    }

    const stages = memoryStages.filter((s) => s.tournamentId === tournament.id).sort((a, b) => a.order - b.order);
    const registrations = memoryRegistrations.filter((r) => r.tournamentId === tournament.id);
    const leaderboard = memoryLeaderboard.filter((lb) => lb.tournamentId === tournament.id).sort((a, b) => a.rank - b.rank);
    const stats = getTournamentStats(tournament.id);
    const totalSlots = tournament.totalTeams || 32;
    const confirmedCount = stats.approved;
    const availableSlots = Math.max(0, totalSlots - confirmedCount);

    res.json({
      success: true,
      data: {
        ...tournament,
        registeredTeams: confirmedCount,
        confirmedTeams: confirmedCount,
        availableSlots,
        stages,
        registrations,
        leaderboard,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments
 * Create new tournament with stages & settings
 */
export const createTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = tournamentSchema.parse(req.body);
    const generatedSlug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newTournamentId = "tourney-" + Date.now();
    const createdTournament = {
      id: newTournamentId,
      ...data,
      slug: generatedSlug,
      registeredTeams: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (dbConnected) {
      try {
        const { slug: _slug, ...createPayload } = data as any;
        const dbResult = await prisma.tournament.create({
          data: {
            ...createPayload,
            registeredTeams: 0,
          } as any,
        });

        if (req.user) {
          await prisma.auditLog.create({
            data: {
              adminId: req.user.id,
              adminEmail: req.user.email,
              action: "CREATE_TOURNAMENT",
              resource: "Tournament",
              details: `Created tournament: ${data.title}`,
            },
          }).catch(() => {});
        }

        res.status(201).json({ success: true, message: "Tournament created successfully", data: dbResult });
        return;
      } catch (err) {
        console.warn("Prisma create failed, falling back to memory store:", err);
      }
    }

    // In-memory create
    memoryTournaments.unshift(createdTournament);

    // Default stages
    const defaultStages = [
      { id: `stage-${newTournamentId}-1`, tournamentId: newTournamentId, name: "ROUND 1", order: 1, status: "UPCOMING", teamsCount: data.totalTeams, createdAt: new Date(), updatedAt: new Date() },
      { id: `stage-${newTournamentId}-2`, tournamentId: newTournamentId, name: "ROUND 2", order: 2, status: "UPCOMING", teamsCount: Math.ceil(data.totalTeams / 2), createdAt: new Date(), updatedAt: new Date() },
      { id: `stage-${newTournamentId}-3`, tournamentId: newTournamentId, name: "GRAND FINALS", order: 3, status: "UPCOMING", teamsCount: 12, createdAt: new Date(), updatedAt: new Date() },
    ];
    memoryStages.push(...defaultStages);

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: { ...createdTournament, stages: defaultStages },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/:id
 * Update tournament details, banner, rules, and configuration
 */
export const updateTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = tournamentSchema.partial().parse(req.body);

    if (dbConnected) {
      try {
        const updated = await prisma.tournament.update({
          where: { id },
          data,
        });

        res.json({ success: true, message: "Tournament updated successfully", data: updated });
        return;
      } catch (err) {
        console.warn("Prisma update failed, updating in-memory store:", err);
      }
    }

    const index = memoryTournaments.findIndex((t) => t.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: "Tournament not found" });
      return;
    }

    memoryTournaments[index] = {
      ...memoryTournaments[index],
      ...data,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      message: "Tournament updated successfully",
      data: memoryTournaments[index],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tournaments/:id
 */
export const deleteTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (dbConnected) {
      try {
        await prisma.tournament.delete({ where: { id } });
        res.json({ success: true, message: "Tournament deleted successfully" });
        return;
      } catch (err) {
        console.warn("Prisma delete failed, deleting from in-memory store:", err);
      }
    }

    memoryTournaments = memoryTournaments.filter((t) => t.id !== id);
    memoryStages = memoryStages.filter((s) => s.tournamentId !== id);
    memoryRegistrations = memoryRegistrations.filter((r) => r.tournamentId !== id);
    memoryLeaderboard = memoryLeaderboard.filter((lb) => lb.tournamentId !== id);

    res.json({ success: true, message: "Tournament deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments/:id/duplicate
 * Duplicate tournament configuration with a " (Copy)" suffix
 */
export const duplicateTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const source = memoryTournaments.find((t) => t.id === id);
    if (!source) {
      res.status(404).json({ success: false, message: "Source tournament not found" });
      return;
    }

    const newId = "tourney-copy-" + Date.now();
    const duplicated = {
      ...source,
      id: newId,
      title: `${source.title} (COPY)`,
      slug: `${source.slug || source.id}-copy-${Date.now().toString().slice(-4)}`,
      status: "DRAFT",
      registeredTeams: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryTournaments.unshift(duplicated);

    // Duplicate stages
    const sourceStages = memoryStages.filter((s) => s.tournamentId === id);
    const newStages = sourceStages.map((s, idx) => ({
      ...s,
      id: `stage-${newId}-${idx + 1}`,
      tournamentId: newId,
      status: "UPCOMING",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    memoryStages.push(...newStages);

    res.status(201).json({
      success: true,
      message: "Tournament duplicated successfully",
      data: { ...duplicated, stages: newStages },
    });
  } catch (error) {
    next(error);
  }
};

// ================= SQUAD REGISTRATION & PAYMENTS =================

/**
 * POST /api/tournaments/:id/register
 * Register a complete squad with roster and optional UPI payment record
 */
export const registerSquad = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = registrationSchema.parse(req.body);

    // Identify user: from auth or find by email/IGN
    let userId = req.user?.id;
    if (!userId && data.captainEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.captainEmail.toLowerCase().trim() },
      });
      if (existingUser) userId = existingUser.id;
    }

    if (!userId && data.captainIgn) {
      const existingUserByIgn = await prisma.user.findFirst({
        where: { ign: { equals: data.captainIgn.trim(), mode: "insensitive" } },
      });
      if (existingUserByIgn) userId = existingUserByIgn.id;
    }

    if (!userId && process.env.NODE_ENV !== "production") {
      const fallbackUser = await prisma.user.findFirst({
        where: { role: { in: ["USER", "ADMIN", "SUPER_ADMIN"] } },
      });
      if (fallbackUser) userId = fallbackUser.id;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "You need to login to join this tournament.",
      });
      return;
    }

    // 1. Fetch tournament from database
    const tournament = await prisma.tournament.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        stages: { orderBy: { order: "asc" } },
        _count: { select: { registrations: true } },
      },
    });

    if (!tournament) {
      res.status(404).json({ success: false, message: "Tournament not found" });
      return;
    }

    // 2. Validate tournament status
    if (tournament.status === "COMPLETED" || tournament.status === "CANCELLED" || tournament.status === "REGISTRATION_CLOSED") {
      res.status(400).json({ success: false, message: "Registration for this tournament is closed" });
      return;
    }

    if (tournament.regDeadline && new Date() > new Date(tournament.regDeadline)) {
      res.status(400).json({ success: false, message: "Tournament registration deadline has passed" });
      return;
    }

    // 3. Validate tournament capacity
    const confirmedCount = await prisma.tournamentRegistration.count({
      where: {
        tournamentId: tournament.id,
        status: { in: ["CONFIRMED", "APPROVED"] },
      },
    });

    if (confirmedCount >= tournament.totalTeams) {
      res.status(400).json({ success: false, message: "TOURNAMENT FULL. All slots have been confirmed." });
      return;
    }

    // 4. Validate duplicate team name in this tournament
    const existingTeam = await prisma.team.findFirst({
      where: {
        tournamentId: tournament.id,
        teamName: { equals: data.teamName.trim(), mode: "insensitive" },
      },
    });

    if (existingTeam) {
      res.status(400).json({
        success: false,
        message: "A team with this name is already registered for this tournament",
      });
      return;
    }

    // 5. Validate player team restriction (if not allowMultipleTeams)
    if (!tournament.allowMultipleTeams) {
      const existingMembership = await prisma.teamMember.findFirst({
        where: {
          userId,
          invitationStatus: "ACCEPTED",
          team: { tournamentId: tournament.id },
        },
      });

      if (existingMembership) {
        res.status(400).json({
          success: false,
          message: "You're already registered with another team for this tournament.",
        });
        return;
      }
    }

    // 6. Check duplicate UTR if payment provided
    const cleanUtr = data.payment?.utr ? data.payment.utr.trim().toUpperCase() : null;
    if (cleanUtr) {
      const dupUtr = await prisma.paymentRecord.findFirst({
        where: { utr: cleanUtr },
      });
      if (dupUtr) {
        res.status(400).json({
          success: false,
          message: "This UTR / Transaction ID has already been submitted for another registration.",
        });
        return;
      }
    }

    // 7. Generate unique Registration Number: REG-YYYY-XXXXXX
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    const regNumber = `REG-${year}-${randomSeq}`;

    const isPaid = tournament.feeAmount > 0;
    const hasUtr = !!cleanUtr;

    let initialStatus = "PENDING";
    let paymentStatus = "PENDING";
    let teamStatus = "PENDING";

    if (isPaid) {
      if (hasUtr) {
        initialStatus = "PAYMENT_UNDER_REVIEW";
        paymentStatus = "UNDER_REVIEW";
      } else {
        initialStatus = "PAYMENT_PENDING";
        paymentStatus = "PENDING";
      }
    } else {
      initialStatus = "CONFIRMED";
      paymentStatus = "VERIFIED";
      teamStatus = "CONFIRMED";
    }

    const firstStageId = tournament.stages.length > 0 ? tournament.stages[0].id : null;
    const reservationMinutes = tournament.slotReservationDuration || 10;
    const reservationExpiry = new Date(Date.now() + reservationMinutes * 60 * 1000);

    // 8. Execute atomic transaction to create Team, Members, Registration, Payment, and SlotReservation
    const result = await prisma.$transaction(async (tx: any) => {
      // A. Create Team
      const team = await tx.team.create({
        data: {
          tournamentId: tournament.id,
          teamName: data.teamName.trim().toUpperCase(),
          teamLogo: data.teamLogo || null,
          leaderId: userId!,
          status: teamStatus,
        },
      });

      // B. Create Leader as TeamMember
      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId: userId!,
          role: "IGL",
          invitationStatus: "ACCEPTED",
        },
      });

      // C. Create SlotReservation
      await tx.slotReservation.create({
        data: {
          tournamentId: tournament.id,
          teamId: team.id,
          status: initialStatus === "CONFIRMED" ? "CONFIRMED" : "ACTIVE",
          expiresAt: reservationExpiry,
        },
      });

      // D. Create TournamentRegistration
      const reg = await tx.tournamentRegistration.create({
        data: {
          registrationNumber: regNumber,
          tournamentId: tournament.id,
          teamId: team.id,
          submittedById: userId,
          teamName: data.teamName.trim().toUpperCase(),
          teamLogo: data.teamLogo || null,
          captainIgn: data.captainIgn.trim().toUpperCase(),
          captainName: data.captainName || null,
          captainPhone: data.captainPhone || data.whatsapp || "",
          captainEmail: data.captainEmail || null,
          whatsapp: data.whatsapp || "",
          discordTag: data.discordTag || null,
          playerNames: data.players && data.players.length > 0 ? data.players.map((p) => p.ign).join(", ") : data.captainIgn,
          status: initialStatus,
          paymentStatus,
          currentStageId: firstStageId,
          slotNumber: confirmedCount + 1,
          approvedAt: initialStatus === "CONFIRMED" ? new Date() : null,
          confirmedAt: initialStatus === "CONFIRMED" ? new Date() : null,
        },
      });

      // E. Create RegistrationPlayer records via batch createMany
      const playersList = (data.players && data.players.length > 0)
        ? data.players
        : [
            {
              name: data.captainName || data.captainIgn,
              ign: data.captainIgn,
              role: "IGL",
              phone: data.whatsapp || "",
              isCaptain: true,
              isSubstitute: false,
            },
          ];

      await tx.registrationPlayer.createMany({
        data: playersList.map((p) => ({
          registrationId: reg.id,
          name: p.name || p.ign || "Player",
          ign: p.ign,
          playerId: p.playerId || null,
          role: p.role || "STARTER",
          phone: p.phone || null,
          email: p.email || null,
          discordId: p.discordId || null,
          isCaptain: p.isCaptain || false,
          isSubstitute: p.isSubstitute || false,
        })),
      });

      // F. Create PaymentRecord
      let paymentRecord = null;
      if (isPaid || data.payment) {
        paymentRecord = await tx.paymentRecord.create({
          data: {
            registrationId: reg.id,
            amount: data.payment?.amount || tournament.feeAmount || 0,
            currency: tournament.currency || "INR",
            method: data.payment?.method || "UPI",
            utr: cleanUtr,
            payerName: data.payment?.payerName || data.captainName || null,
            screenshot: data.payment?.screenshot || null,
            status: paymentStatus,
            remarks: data.payment?.remarks || null,
            submittedAt: hasUtr ? new Date() : null,
          },
        });
      }

      // G. If free, increment tournament registeredTeams and add leaderboard entry
      if (initialStatus === "CONFIRMED") {
        await tx.tournament.update({
          where: { id: tournament.id },
          data: { registeredTeams: { increment: 1 } },
        });

        await tx.tournamentLeaderboard.create({
          data: {
            tournamentId: tournament.id,
            teamId: team.id,
            teamName: data.teamName.trim().toUpperCase(),
            rank: confirmedCount + 1,
            status: "ACTIVE",
          },
        });
      }

      return { team, reg, paymentRecord };
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    // H. Non-blocking Post-Registration Tasks (Notifications & Activity Logs)
    (async () => {
      try {
        if (initialStatus === "CONFIRMED") {
          await prisma.notification.create({
            data: {
              userId: userId!,
              type: "REGISTRATION_CONFIRMED",
              title: "Registration Confirmed! 🏆",
              message: `Your team ${data.teamName} has officially registered for ${tournament.title}! Registration ID: ${regNumber}`,
              metadata: JSON.stringify({
                registrationId: result.reg.id,
                tournamentId: tournament.id,
                status: "CONFIRMED",
              }),
            },
          });
        } else if (hasUtr) {
          await prisma.notification.create({
            data: {
              userId: userId!,
              type: "PAYMENT_UNDER_REVIEW",
              title: "Payment Submitted ⏳",
              message: `Your payment of ₹${data.payment?.amount || tournament.feeAmount} for ${data.teamName} has been submitted with UTR ${cleanUtr}. Verification is pending.`,
              metadata: JSON.stringify({
                registrationId: result.reg.id,
                tournamentId: tournament.id,
                utr: cleanUtr,
              }),
            },
          });
        }

        await prisma.activityLog.create({
          data: {
            userId,
            tournamentId: tournament.id,
            teamId: result.team.id,
            registrationId: result.reg.id,
            action: "REGISTRATION_CREATED",
            description: `Squad ${data.teamName} registered by ${data.captainIgn}. Initial status: ${initialStatus}`,
          },
        });
      } catch (postErr) {
        console.warn("[Post-Registration Side Effects Warning]", postErr);
      }
    })();

    res.status(201).json({
      success: true,
      message: initialStatus === "CONFIRMED" ? "Registration confirmed! You have joined the tournament." : "Squad registered! Please proceed to complete payment verification.",
      data: {
        id: result.reg.id,
        registrationId: result.reg.id,
        registrationNumber: regNumber,
        teamId: result.team.id,
        teamName: result.team.teamName,
        status: initialStatus,
        paymentStatus,
        slotReservationExpiry: reservationExpiry,
        payment: result.paymentRecord,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments/registrations/:id/payment
 * User submits manual UPI payment (UTR + screenshot)
 */
export const submitPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { utr, screenshot, amount, payerName, method = "UPI", remarks } = req.body;

    if (!utr || !utr.trim()) {
      res.status(400).json({ success: false, message: "UTR / Transaction ID is required" });
      return;
    }

    const cleanUtr = utr.trim().toUpperCase();

    // Check duplicate UTR across payments
    const existingUtr = await prisma.paymentRecord.findFirst({
      where: {
        utr: cleanUtr,
        registrationId: { not: id },
      },
    });

    if (existingUtr) {
      res.status(400).json({
        success: false,
        message: "This UTR / Transaction ID has already been submitted for another registration.",
      });
      return;
    }

    const registration = await prisma.tournamentRegistration.findUnique({
      where: { id },
      include: {
        tournament: true,
        team: true,
      },
    });

    if (!registration) {
      res.status(404).json({ success: false, message: "Registration not found" });
      return;
    }

    const submittedAmount = amount ? Number(amount) : registration.tournament.feeAmount;

    const payment = await prisma.paymentRecord.upsert({
      where: { registrationId: id },
      update: {
        utr: cleanUtr,
        screenshot: screenshot || null,
        amount: submittedAmount,
        payerName: payerName || registration.captainName || null,
        method,
        remarks: remarks || null,
        status: "UNDER_REVIEW",
        submittedAt: new Date(),
        rejectionReason: null,
      },
      create: {
        registrationId: id,
        utr: cleanUtr,
        screenshot: screenshot || null,
        amount: submittedAmount,
        payerName: payerName || registration.captainName || null,
        method,
        remarks: remarks || null,
        status: "UNDER_REVIEW",
        submittedAt: new Date(),
      },
    });

    await prisma.tournamentRegistration.update({
      where: { id },
      data: {
        status: "PAYMENT_UNDER_REVIEW",
        paymentStatus: "UNDER_REVIEW",
      },
    });

    if (registration.submittedById) {
      await prisma.notification.create({
        data: {
          userId: registration.submittedById,
          type: "PAYMENT_UNDER_REVIEW",
          title: "Payment Submitted For Review ⏳",
          message: `Your payment of ₹${submittedAmount} for ${registration.teamName} with UTR ${cleanUtr} has been submitted for admin verification.`,
          metadata: JSON.stringify({
            registrationId: registration.id,
            tournamentId: registration.tournamentId,
            utr: cleanUtr,
          }),
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: req.user?.id,
        tournamentId: registration.tournamentId,
        teamId: registration.teamId,
        registrationId: registration.id,
        action: "PAYMENT_SUBMITTED",
        description: `User submitted UTR ${cleanUtr} for payment of ₹${submittedAmount}`,
      },
    });

    res.json({
      success: true,
      message: "Payment submitted successfully. Waiting for admin verification.",
      data: {
        registrationId: registration.id,
        status: "PAYMENT_UNDER_REVIEW",
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/registrations/:id/payment-verify
 * Admin verifies payment: updates payment, registration, team, slot reservation, and leaderboard
 */
export const verifyPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const adminUser = req.user;

    const registration = await prisma.tournamentRegistration.findUnique({
      where: { id },
      include: {
        tournament: true,
        team: true,
        payment: true,
      },
    });

    if (!registration) {
      res.status(404).json({ success: false, message: "Registration not found" });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      // 1. Update PaymentRecord
      if (registration.payment) {
        await tx.paymentRecord.update({
          where: { registrationId: id },
          data: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: adminUser?.email || "Admin",
          },
        });
      }

      // 2. Update Registration
      await tx.tournamentRegistration.update({
        where: { id },
        data: {
          status: "CONFIRMED",
          paymentStatus: "VERIFIED",
          confirmedAt: new Date(),
          approvedAt: new Date(),
        },
      });

      // 3. Update Team if exists
      if (registration.teamId) {
        await tx.team.update({
          where: { id: registration.teamId },
          data: { status: "CONFIRMED" },
        });

        // 4. Update SlotReservation
        await tx.slotReservation.updateMany({
          where: { teamId: registration.teamId },
          data: { status: "CONFIRMED" },
        });

        // 5. Add or activate Leaderboard entry
        const existingLb = await tx.tournamentLeaderboard.findFirst({
          where: {
            tournamentId: registration.tournamentId,
            teamId: registration.teamId,
          },
        });

        if (!existingLb) {
          const count = await tx.tournamentLeaderboard.count({
            where: { tournamentId: registration.tournamentId },
          });
          await tx.tournamentLeaderboard.create({
            data: {
              tournamentId: registration.tournamentId,
              teamId: registration.teamId,
              teamName: registration.teamName,
              tag: registration.team?.teamTag || null,
              rank: count + 1,
              status: "ACTIVE",
            },
          });
        }
      }

      // 6. Increment tournament registered teams count
      await tx.tournament.update({
        where: { id: registration.tournamentId },
        data: {
          registeredTeams: { increment: 1 },
        },
      });

      // 7. Notification
      if (registration.submittedById) {
        await tx.notification.create({
          data: {
            userId: registration.submittedById,
            type: "PAYMENT_VERIFIED",
            title: "Payment Verified! Registration Confirmed 🏆",
            message: `Your payment has been verified! Team ${registration.teamName} has officially joined ${registration.tournament.title}. Registration ID: ${registration.registrationNumber || registration.id}`,
            metadata: JSON.stringify({
              registrationId: registration.id,
              tournamentId: registration.tournamentId,
              teamId: registration.teamId,
              status: "CONFIRMED",
            }),
          },
        });
      }

      // 8. Activity Log
      await tx.activityLog.create({
        data: {
          adminId: adminUser?.id,
          tournamentId: registration.tournamentId,
          teamId: registration.teamId,
          registrationId: registration.id,
          action: "PAYMENT_VERIFIED",
          description: `Admin verified payment for registration ${registration.registrationNumber || registration.id}`,
        },
      });
    });

    res.json({
      success: true,
      message: "Payment verified and registration confirmed!",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/registrations/:id/payment-reject
 * Admin rejects payment with reason
 */
export const rejectPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { rejectionReason = "UTR or payment screenshot verification failed" } = req.body;
    const adminUser = req.user;

    const registration = await prisma.tournamentRegistration.findUnique({
      where: { id },
      include: {
        tournament: true,
        payment: true,
      },
    });

    if (!registration) {
      res.status(404).json({ success: false, message: "Registration not found" });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      // 1. Update PaymentRecord
      if (registration.payment) {
        await tx.paymentRecord.update({
          where: { registrationId: id },
          data: {
            status: "REJECTED",
            rejectionReason,
            verifiedAt: new Date(),
            verifiedBy: adminUser?.email || "Admin",
          },
        });
      }

      // 2. Update Registration
      await tx.tournamentRegistration.update({
        where: { id },
        data: {
          status: "REJECTED",
          paymentStatus: "REJECTED",
          rejectedAt: new Date(),
          adminNotes: rejectionReason,
        },
      });

      // 3. Release slot reservation
      if (registration.teamId) {
        await tx.slotReservation.updateMany({
          where: { teamId: registration.teamId },
          data: { status: "RELEASED" },
        });
      }

      // 4. Send user notification with rejection reason
      if (registration.submittedById) {
        await tx.notification.create({
          data: {
            userId: registration.submittedById,
            type: "PAYMENT_REJECTED",
            title: "Payment Rejected ⚠️",
            message: `Your payment for ${registration.teamName} in ${registration.tournament.title} was rejected. Reason: ${rejectionReason}. You may retry your payment.`,
            metadata: JSON.stringify({
              registrationId: registration.id,
              tournamentId: registration.tournamentId,
              rejectionReason,
            }),
          },
        });
      }

      // 5. Activity Log
      await tx.activityLog.create({
        data: {
          adminId: adminUser?.id,
          tournamentId: registration.tournamentId,
          teamId: registration.teamId,
          registrationId: registration.id,
          action: "PAYMENT_REJECTED",
          description: `Admin rejected payment. Reason: ${rejectionReason}`,
        },
      });
    });

    res.json({
      success: true,
      message: "Payment rejected and user notified with reason.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tournaments/registrations
 * Filterable across tournaments, stages, and payment statuses
 */
export const getAllRegistrations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tournamentId, stageId, status, paymentStatus, search } = req.query;

    if (dbConnected) {
      try {
        const where: any = {};
        if (tournamentId && tournamentId !== "ALL") where.tournamentId = String(tournamentId);
        if (stageId && stageId !== "ALL") where.currentStageId = String(stageId);
        if (status && status !== "ALL") where.status = String(status);
        if (paymentStatus && paymentStatus !== "ALL") where.paymentStatus = String(paymentStatus);
        if (search) {
          const q = String(search);
          where.OR = [
            { teamName: { contains: q, mode: "insensitive" } },
            { captainIgn: { contains: q, mode: "insensitive" } },
            { captainName: { contains: q, mode: "insensitive" } },
            { captainEmail: { contains: q, mode: "insensitive" } },
            { whatsapp: { contains: q, mode: "insensitive" } },
            { registrationNumber: { contains: q, mode: "insensitive" } },
            { payment: { utr: { contains: q, mode: "insensitive" } } },
          ];
        }

        const list = await prisma.tournamentRegistration.findMany({
          where,
          include: {
            tournament: {
              select: { id: true, title: true, game: true, prizePool: true, status: true, totalTeams: true },
            },
            currentStage: { select: { id: true, name: true, order: true } },
            payment: true,
            players: true,
            team: {
              include: {
                leader: { select: { id: true, username: true, ign: true, fullName: true, avatarUrl: true, email: true, phone: true, gameUid: true } },
                members: { include: { user: { select: { id: true, username: true, ign: true, fullName: true, gameUid: true, avatarUrl: true } } } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        res.json({ success: true, data: list });
        return;
      } catch (err) {
        console.warn("Prisma getAllRegistrations failed, falling back to memory store:", err);
      }
    }

    let result = [...memoryRegistrations];

    if (tournamentId && tournamentId !== "ALL") {
      result = result.filter((r) => r.tournamentId === String(tournamentId));
    }
    if (stageId && stageId !== "ALL") {
      result = result.filter((r) => r.currentStageId === String(stageId));
    }
    if (status && status !== "ALL") {
      result = result.filter((r) => r.status === String(status));
    }
    if (paymentStatus && paymentStatus !== "ALL") {
      result = result.filter((r) => r.paymentStatus === String(paymentStatus));
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter((r) => {
        const teamMatch = r.teamName?.toLowerCase().includes(q);
        const captMatch = r.captainIgn?.toLowerCase().includes(q) || r.captainName?.toLowerCase().includes(q);
        const phoneMatch = r.whatsapp?.includes(q) || r.captainPhone?.includes(q);
        const emailMatch = r.captainEmail?.toLowerCase().includes(q);
        const utrMatch = r.payment?.utr?.toLowerCase().includes(q);
        const discordMatch = r.discordTag?.toLowerCase().includes(q);
        const playerMatch = r.players?.some((p: any) => p.ign?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q));
        return teamMatch || captMatch || phoneMatch || emailMatch || utrMatch || discordMatch || playerMatch;
      });
    }

    const mapped = result.map((r) => {
      const t = memoryTournaments.find((tourney) => tourney.id === r.tournamentId);
      const stage = memoryStages.find((s) => s.id === r.currentStageId);
      return {
        ...r,
        tournament: t ? { id: t.id, title: t.title, game: t.game, prizePool: t.prizePool, status: t.status } : null,
        currentStage: stage ? { id: stage.id, name: stage.name, order: stage.order } : null,
      };
    });

    res.json({ success: true, data: mapped });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tournaments/:id/teams
 * View all teams registered for a tournament
 */
export const getTournamentTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const teams = await prisma.team.findMany({
      where: { tournamentId: id },
      include: {
        leader: {
          select: { id: true, username: true, ign: true, gameUid: true, fullName: true, avatarUrl: true, email: true, phone: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, ign: true, gameUid: true, fullName: true, avatarUrl: true },
            },
          },
        },
        registration: {
          include: { payment: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, teams });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tournaments/admin/analytics
 * Aggregated statistics for admin portal
 */
export const getTournamentAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tournamentId } = req.query;
    const whereClause = tournamentId ? { tournamentId: String(tournamentId) } : {};

    const [
      totalTeams,
      confirmedTeams,
      paymentPending,
      paymentsUnderReview,
      paymentsFailed,
      verifiedPayments,
      pendingPayments,
    ] = await Promise.all([
      prisma.tournamentRegistration.count({ where: whereClause }),
      prisma.tournamentRegistration.count({ where: { ...whereClause, status: { in: ["CONFIRMED", "APPROVED"] } } }),
      prisma.tournamentRegistration.count({ where: { ...whereClause, status: "PAYMENT_PENDING" } }),
      prisma.tournamentRegistration.count({ where: { ...whereClause, status: "PAYMENT_UNDER_REVIEW" } }),
      prisma.tournamentRegistration.count({ where: { ...whereClause, status: "REJECTED" } }),
      prisma.paymentRecord.aggregate({
        where: {
          status: "VERIFIED",
          ...(tournamentId ? { registration: { tournamentId: String(tournamentId) } } : {}),
        },
        _sum: { amount: true },
      }),
      prisma.paymentRecord.aggregate({
        where: {
          status: { in: ["PENDING", "UNDER_REVIEW"] },
          ...(tournamentId ? { registration: { tournamentId: String(tournamentId) } } : {}),
        },
        _sum: { amount: true },
      }),
    ]);

    let totalSlots = 0;
    if (tournamentId) {
      const tourney = await prisma.tournament.findUnique({
        where: { id: String(tournamentId) },
        select: { totalTeams: true },
      });
      totalSlots = tourney?.totalTeams || 32;
    } else {
      const tourneys = await prisma.tournament.findMany({ select: { totalTeams: true } });
      totalSlots = tourneys.reduce((sum: any, t: any) => sum + (t.totalTeams || 32), 0);
    }

    const availableSlots = Math.max(0, totalSlots - confirmedTeams);

    res.json({
      success: true,
      analytics: {
        totalTeams,
        confirmedTeams,
        paymentPending,
        paymentsUnderReview,
        paymentsFailed,
        rejectedRegistrations: paymentsFailed,
        availableSlots,
        totalSlots,
        totalRevenue: verifiedPayments._sum.amount || 0,
        pendingRevenue: pendingPayments._sum.amount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/registrations/:id/status
 * Approve, reject, waitlist or disqualify registration
 */
export const updateRegistrationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, slotNumber, adminNotes } = req.body;

    if (dbConnected) {
      try {
        const updated = await prisma.tournamentRegistration.update({
          where: { id },
          data: {
            status,
            slotNumber: slotNumber !== undefined ? Number(slotNumber) : undefined,
            adminNotes,
            approvedAt: status === "CONFIRMED" || status === "APPROVED" ? new Date() : undefined,
            rejectedAt: status === "REJECTED" ? new Date() : undefined,
          },
          include: { team: true, tournament: true },
        });

        if (updated.teamId && (status === "CONFIRMED" || status === "APPROVED")) {
          await prisma.team.update({
            where: { id: updated.teamId },
            data: { status: "CONFIRMED" },
          });
        }

        res.json({ success: true, message: `Registration status updated to ${status}`, data: updated });
        return;
      } catch (err) {
        console.warn("Prisma updateRegistrationStatus failed:", err);
      }
    }

    const registration = memoryRegistrations.find((r) => r.id === id);
    if (!registration) {
      res.status(404).json({ success: false, message: "Registration not found" });
      return;
    }

    const oldStatus = registration.status;
    registration.status = status;
    if (slotNumber !== undefined) registration.slotNumber = Number(slotNumber);
    if (adminNotes !== undefined) registration.adminNotes = adminNotes;

    if (status === "APPROVED" || status === "CONFIRMED") registration.approvedAt = new Date();
    if (status === "REJECTED") registration.rejectedAt = new Date();
    registration.updatedAt = new Date();

    res.json({
      success: true,
      message: `Registration status updated to ${status}`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/registrations/:id/payment
 * Verify, reject, or refund squad registration payment
 */
export const updatePaymentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus, adminNotes, autoApprove } = req.body;

    if (paymentStatus === "VERIFIED") {
      await verifyPayment(req, res, next);
      return;
    } else if (paymentStatus === "REJECTED") {
      await rejectPayment(req, res, next);
      return;
    }

    if (dbConnected) {
      try {
        await prisma.tournamentRegistration.update({
          where: { id },
          data: {
            paymentStatus,
            payment: {
              update: {
                status: paymentStatus,
                adminNotes,
              },
            },
          },
        });
        res.json({ success: true, message: `Payment status updated to ${paymentStatus}` });
        return;
      } catch (err) {
        console.warn("Prisma updatePaymentStatus failed:", err);
      }
    }

    const registration = memoryRegistrations.find((r) => r.id === id);
    if (!registration) {
      res.status(404).json({ success: false, message: "Registration not found" });
      return;
    }

    if (!registration.payment) {
      registration.payment = {
        id: "pay-" + Date.now(),
        registrationId: id,
        amount: 499,
        method: "UPI",
        utr: null,
        payerName: registration.captainName || null,
        screenshot: null,
        status: paymentStatus,
        remarks: null,
        submittedAt: new Date(),
        verifiedAt: paymentStatus === "VERIFIED" ? new Date() : null,
        verifiedBy: req.user?.email || "Admin",
        adminNotes: adminNotes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      registration.payment.status = paymentStatus;
      if (adminNotes) registration.payment.adminNotes = adminNotes;
      if (paymentStatus === "VERIFIED") {
        registration.payment.verifiedAt = new Date();
        registration.payment.verifiedBy = req.user?.email || "Admin";
      }
      registration.payment.updatedAt = new Date();
    }

    registration.paymentStatus = paymentStatus;

    if (paymentStatus === "VERIFIED" && autoApprove) {
      registration.status = "APPROVED";
      registration.approvedAt = new Date();
    }

    res.json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments/registrations/bulk
 * Perform bulk approve, reject, payment verification, or stage movement
 */
export const bulkActionRegistrations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { registrationIds, action, targetStageId } = req.body;

    if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
      res.status(400).json({ success: false, message: "No registration IDs provided" });
      return;
    }

    const affected: any[] = [];
    const performer = req.user?.email || "Admin";

    for (const regId of registrationIds) {
      const reg = memoryRegistrations.find((r) => r.id === regId);
      if (!reg) continue;

      if (action === "APPROVE") {
        reg.status = "APPROVED";
        reg.approvedAt = new Date();
        reg.activityLogs.push({
          id: "log-" + Date.now() + Math.random(),
          registrationId: reg.id,
          action: "BULK_APPROVED",
          performedBy: performer,
          details: "Approved via bulk action",
          createdAt: new Date(),
        });
      } else if (action === "REJECT") {
        reg.status = "REJECTED";
        reg.rejectedAt = new Date();
        reg.activityLogs.push({
          id: "log-" + Date.now() + Math.random(),
          registrationId: reg.id,
          action: "BULK_REJECTED",
          performedBy: performer,
          details: "Rejected via bulk action",
          createdAt: new Date(),
        });
      } else if (action === "VERIFY_PAYMENT") {
        reg.paymentStatus = "VERIFIED";
        if (reg.payment) {
          reg.payment.status = "VERIFIED";
          reg.payment.verifiedAt = new Date();
          reg.payment.verifiedBy = performer;
        }
        reg.activityLogs.push({
          id: "log-" + Date.now() + Math.random(),
          registrationId: reg.id,
          action: "BULK_PAYMENT_VERIFIED",
          performedBy: performer,
          details: "Payment verified via bulk action",
          createdAt: new Date(),
        });
      } else if (action === "MOVE_STAGE" && targetStageId) {
        const oldStage = memoryStages.find((s) => s.id === reg.currentStageId)?.name || "Previous";
        const newStage = memoryStages.find((s) => s.id === targetStageId)?.name || "Next Stage";
        reg.currentStageId = targetStageId;
        reg.activityLogs.push({
          id: "log-" + Date.now() + Math.random(),
          registrationId: reg.id,
          action: "BULK_STAGE_ADVANCEMENT",
          performedBy: performer,
          details: `Moved from ${oldStage} to ${newStage} via bulk advancement`,
          createdAt: new Date(),
        });
      }
      reg.updatedAt = new Date();
      affected.push(reg);
    }

    res.json({
      success: true,
      message: `Bulk action ${action} executed successfully on ${affected.length} registrations`,
      data: { count: affected.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tournaments/:id/export
 * Export tournament registrations as CSV format
 */
export const exportRegistrationsCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { stageId, status } = req.query;

    let list = memoryRegistrations.filter((r) => r.tournamentId === id);
    if (stageId && stageId !== "ALL") list = list.filter((r) => r.currentStageId === stageId);
    if (status && status !== "ALL") list = list.filter((r) => r.status === status);

    const headers = [
      "Registration Number",
      "Team Name",
      "Captain IGN",
      "Captain Name",
      "Phone / WhatsApp",
      "Discord",
      "Email",
      "Roster Starters",
      "Payment Status",
      "UTR Number",
      "Amount",
      "Registration Status",
      "Current Stage",
      "Registered Date",
    ];

    const rows = list.map((r) => {
      const stageName = memoryStages.find((s) => s.id === r.currentStageId)?.name || "Registration";
      return [
        `"${r.registrationNumber || ""}"`,
        `"${r.teamName}"`,
        `"${r.captainIgn}"`,
        `"${r.captainName || ""}"`,
        `"${r.whatsapp}"`,
        `"${r.discordTag || ""}"`,
        `"${r.captainEmail || ""}"`,
        `"${r.playerNames || ""}"`,
        `"${r.paymentStatus}"`,
        `"${r.payment?.utr || ""}"`,
        `"${r.payment?.amount || 0}"`,
        `"${r.status}"`,
        `"${stageName}"`,
        `"${new Date(r.createdAt).toLocaleString()}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="lordz-${id}-registrations.csv"`);
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ================= STAGE MANAGEMENT & PROGRESSION =================

/**
 * GET /api/tournaments/:id/stages
 */
export const getStages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const stages = memoryStages.filter((s) => s.tournamentId === id).sort((a, b) => a.order - b.order);

    // Attach count of squads currently in each stage
    const stagesWithCounts = stages.map((s) => {
      const teams = memoryRegistrations.filter((r) => r.tournamentId === id && r.currentStageId === s.id);
      return {
        ...s,
        currentTeamsCount: teams.length,
        teams: teams.map((t) => ({
          id: t.id,
          teamName: t.teamName,
          captainIgn: t.captainIgn,
          status: t.status,
          paymentStatus: t.paymentStatus,
        })),
      };
    });

    res.json({ success: true, data: stagesWithCounts });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments/:id/stages
 */
export const createStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = stageSchema.parse(req.body);

    const newStage = {
      id: "stage-" + Date.now(),
      tournamentId: id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStages.push(newStage);
    res.status(201).json({ success: true, message: "Stage created successfully", data: newStage });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/stages/:stageId
 */
export const updateStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stageId } = req.params;
    const data = stageSchema.partial().parse(req.body);

    const index = memoryStages.findIndex((s) => s.id === stageId);
    if (index === -1) {
      res.status(404).json({ success: false, message: "Stage not found" });
      return;
    }

    memoryStages[index] = {
      ...memoryStages[index],
      ...data,
      updatedAt: new Date(),
    };

    res.json({ success: true, message: "Stage updated successfully", data: memoryStages[index] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tournaments/stages/:stageId
 */
export const deleteStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stageId } = req.params;
    memoryStages = memoryStages.filter((s) => s.id !== stageId);
    res.json({ success: true, message: "Stage deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments/:id/stages/move-teams
 * Advance checked teams from one stage to the target stage without duplicating records
 */
export const moveTeamsToStage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { registrationIds } = req.body;
    const targetStageId = req.body.targetStageId || req.body.toStageId;

    if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
      res.status(400).json({ success: false, message: "Please select at least one team to move" });
      return;
    }

    const targetStage = memoryStages.find(
      (s) => (s.id === targetStageId || s.id.toLowerCase() === String(targetStageId).toLowerCase()) &&
             (s.tournamentId === id || !s.tournamentId)
    );
    if (!targetStage) {
      res.status(404).json({ success: false, message: "Target tournament stage not found" });
      return;
    }

    const performer = req.user?.email || "Admin";
    const movedTeams: string[] = [];

    for (const regId of registrationIds) {
      const reg = memoryRegistrations.find((r) => r.id === regId && r.tournamentId === id);
      if (!reg) continue;

      const fromStage = memoryStages.find((s) => s.id === reg.currentStageId)?.name || "Previous Stage";
      reg.currentStageId = targetStageId;
      reg.updatedAt = new Date();

      reg.activityLogs.push({
        id: "log-" + Date.now() + Math.random(),
        registrationId: reg.id,
        action: "STAGE_ADVANCEMENT",
        performedBy: performer,
        details: `Promoted from ${fromStage} to ${targetStage.name} by ${performer}`,
        createdAt: new Date(),
      });

      movedTeams.push(reg.teamName);
    }

    res.json({
      success: true,
      message: `Successfully advanced ${movedTeams.length} teams to ${targetStage.name}!`,
      data: {
        targetStage: targetStage.name,
        count: movedTeams.length,
        teams: movedTeams,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ================= TOURNAMENT LEADERBOARD =================

/**
 * GET /api/tournaments/:id/leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    // Ensure ranks are sorted accurately
    recalculateLeaderboardRanks(id);

    const entries = memoryLeaderboard.filter((lb) => lb.tournamentId === id).sort((a, b) => a.rank - b.rank);
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tournaments/:id/leaderboard
 * Batch update leaderboard points, kills, wins, and auto-recalculate ranks
 */
export const updateLeaderboardBatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { entries } = req.body;

    if (!Array.isArray(entries)) {
      res.status(400).json({ success: false, message: "Invalid leaderboard entries array" });
      return;
    }

    // Replace or update tournament leaderboard entries
    memoryLeaderboard = memoryLeaderboard.filter((lb) => lb.tournamentId !== id);

    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const kills = Number(e.kills) || 0;
      const placementPoints = Number(e.placementPoints) || 0;
      const bonusPoints = Number(e.bonusPoints) || 0;
      // Formula: Total = Placement + Kills + Bonus (or specified totalPoints)
      const computedTotal = (e.totalPoints !== undefined && e.totalPoints !== null && !isNaN(Number(e.totalPoints)))
        ? Number(e.totalPoints)
        : placementPoints + kills + bonusPoints;

      memoryLeaderboard.push({
        id: e.id || `lb-${id}-${Date.now()}-${i}`,
        tournamentId: id,
        teamName: e.teamName,
        tag: e.tag || null,
        rank: i + 1,
        matchesPlayed: Number(e.matchesPlayed) || 0,
        wins: Number(e.wins) || 0,
        losses: Number(e.losses) || 0,
        kills,
        placementPoints,
        bonusPoints,
        totalPoints: computedTotal,
        status: e.status || "ACTIVE",
        updatedAt: new Date(),
      });
    }

    recalculateLeaderboardRanks(id);

    const saved = memoryLeaderboard.filter((lb) => lb.tournamentId === id).sort((a, b) => a.rank - b.rank);

    res.json({
      success: true,
      message: "Tournament leaderboard updated and ranked successfully",
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tournaments/:id/leaderboard/entry
 */
export const addLeaderboardEntry = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { teamName, tag, matchesPlayed, wins, kills, placementPoints, bonusPoints } = req.body;

    if (!teamName) {
      res.status(400).json({ success: false, message: "Team name is required" });
      return;
    }

    const currentCount = memoryLeaderboard.filter((lb) => lb.tournamentId === id).length;
    const pKills = Number(kills) || 0;
    const pPlacement = Number(placementPoints) || 0;
    const pBonus = Number(bonusPoints) || 0;
    const total = pPlacement + pKills + pBonus;

    const newEntry = {
      id: "lb-" + Date.now(),
      tournamentId: id,
      teamName: teamName.toUpperCase(),
      tag: tag ? tag.toUpperCase() : null,
      rank: currentCount + 1,
      matchesPlayed: Number(matchesPlayed) || 0,
      wins: Number(wins) || 0,
      losses: 0,
      kills: pKills,
      placementPoints: pPlacement,
      bonusPoints: pBonus,
      totalPoints: total,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryLeaderboard.push(newEntry);
    recalculateLeaderboardRanks(id);

    res.status(201).json({
      success: true,
      message: "Team added to tournament leaderboard",
      data: newEntry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tournaments/:id/leaderboard/:entryId
 */
export const deleteLeaderboardEntry = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, entryId } = req.params;
    memoryLeaderboard = memoryLeaderboard.filter((lb) => lb.id !== entryId);
    recalculateLeaderboardRanks(id);
    res.json({ success: true, message: "Team removed from leaderboard" });
  } catch (error) {
    next(error);
  }
};
