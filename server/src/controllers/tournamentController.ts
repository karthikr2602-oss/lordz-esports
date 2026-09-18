import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const tournamentSchema = z.object({
  title: z.string().min(3),
  game: z.string().default("FREE FIRE MAX"),
  gameCategory: z.string().default("FREE FIRE MAX"),
  status: z.enum(["LIVE", "UPCOMING", "COMPLETED"]).default("UPCOMING"),
  prizePool: z.string().default("₹50,000"),
  entryFee: z.string().default("FREE ENTRY"),
  slots: z.string().default("32 TEAMS"),
  date: z.string(),
  format: z.string().default("BATTLE ROYALE • 6 MATCHES"),
  featured: z.boolean().default(false),
  tagline: z.string().default("Official Lordz Esports Tournament"),
  streamUrl: z.string().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  rules: z.string().optional().nullable(),
  totalTeams: z.number().default(32),
});

const registrationSchema = z.object({
  teamName: z.string().min(2),
  captainIgn: z.string().min(2),
  whatsapp: z.string().min(8),
  discordTag: z.string().optional().nullable(),
  playerNames: z.string().optional().nullable(),
});

export const getTournaments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, gameCategory, featured, search } = req.query;

    const where: any = {};
    if (status && status !== "ALL") where.status = String(status);
    if (gameCategory && gameCategory !== "ALL") where.gameCategory = String(gameCategory);
    if (featured !== undefined) where.featured = featured === "true";
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { tagline: { contains: String(search) } },
        { game: { contains: String(search) } },
      ];
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    res.json({ success: true, data: tournaments });
  } catch (error) {
    next(error);
  }
};

export const getTournamentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        matches: {
          orderBy: { createdAt: "desc" },
        },
        standings: {
          orderBy: { sortOrder: "asc" },
        },
        registrations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!tournament) {
      res.status(404).json({ success: false, message: "Tournament not found" });
      return;
    }

    res.json({ success: true, data: tournament });
  } catch (error) {
    next(error);
  }
};

export const createTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = tournamentSchema.parse(req.body);
    const tournament = await prisma.tournament.create({
      data: {
        ...data,
        registeredTeams: 0,
      },
    });

    // Audit log
    if (req.user) {
      await prisma.auditLog.create({
        data: {
          adminId: req.user.id,
          adminEmail: req.user.email,
          action: "CREATE_TOURNAMENT",
          resource: "Tournament",
          details: `Created tournament: ${tournament.title}`,
        },
      });
    }

    res.status(201).json({ success: true, message: "Tournament created successfully", data: tournament });
  } catch (error) {
    next(error);
  }
};

export const updateTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = tournamentSchema.partial().parse(req.body);

    const tournament = await prisma.tournament.update({
      where: { id },
      data,
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          adminId: req.user.id,
          adminEmail: req.user.email,
          action: "UPDATE_TOURNAMENT",
          resource: "Tournament",
          details: `Updated tournament ${tournament.title}`,
        },
      });
    }

    res.json({ success: true, message: "Tournament updated successfully", data: tournament });
  } catch (error) {
    next(error);
  }
};

export const deleteTournament = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.delete({
      where: { id },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          adminId: req.user.id,
          adminEmail: req.user.email,
          action: "DELETE_TOURNAMENT",
          resource: "Tournament",
          details: `Deleted tournament ${tournament.title}`,
        },
      });
    }

    res.json({ success: true, message: "Tournament deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const registerSquad = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = registrationSchema.parse(req.body);

    const tournament = await prisma.tournament.findUnique({
      where: { id },
    });

    if (!tournament) {
      res.status(404).json({ success: false, message: "Tournament not found" });
      return;
    }

    if (tournament.status === "COMPLETED") {
      res.status(400).json({ success: false, message: "This tournament has already completed" });
      return;
    }

    // Check if team already registered for this tournament
    const existing = await prisma.tournamentRegistration.findFirst({
      where: {
        tournamentId: id,
        teamName: { equals: data.teamName },
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: "A team with this name is already registered for this tournament",
      });
      return;
    }

    const registration = await prisma.tournamentRegistration.create({
      data: {
        tournamentId: id,
        teamName: data.teamName.toUpperCase(),
        captainIgn: data.captainIgn.toUpperCase(),
        whatsapp: data.whatsapp,
        discordTag: data.discordTag,
        playerNames: data.playerNames,
        status: "APPROVED", // Auto-approved or pending based on admin preference
      },
    });

    // Increment registered teams counter
    await prisma.tournament.update({
      where: { id },
      data: {
        registeredTeams: { increment: 1 },
      },
    });

    res.status(201).json({
      success: true,
      message: "Squad registered successfully!",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRegistrations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tournamentId, status, search } = req.query;

    const where: any = {};
    if (tournamentId) where.tournamentId = String(tournamentId);
    if (status && status !== "ALL") where.status = String(status);
    if (search) {
      where.OR = [
        { teamName: { contains: String(search) } },
        { captainIgn: { contains: String(search) } },
        { whatsapp: { contains: String(search) } },
      ];
    }

    const registrations = await prisma.tournamentRegistration.findMany({
      where,
      include: {
        tournament: {
          select: { id: true, title: true, game: true, prizePool: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};

export const updateRegistrationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, slotNumber } = req.body;

    const registration = await prisma.tournamentRegistration.update({
      where: { id },
      data: {
        status,
        ...(slotNumber !== undefined ? { slotNumber: Number(slotNumber) } : {}),
      },
      include: { tournament: true },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          adminId: req.user.id,
          adminEmail: req.user.email,
          action: "UPDATE_REGISTRATION_STATUS",
          resource: "TournamentRegistration",
          details: `Updated registration ${registration.teamName} to status ${status}`,
        },
      });
    }

    res.json({
      success: true,
      message: `Registration status updated to ${status}`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
