import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const partnerSchema = z.object({
  name: z.string().min(2),
  category: z.string().default("Gaming"),
  tier: z.enum(["MAIN SPONSOR", "OFFICIAL PARTNER", "BROADCAST PARTNER"]).default("OFFICIAL PARTNER"),
  logoImage: z.string().optional().nullable(),
  cardImage: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const getPartners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const partners = await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    res.json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
};

export const getAllPartnersAdmin = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { sortOrder: "asc" },
    });
    res.json({ success: true, data: partners });
  } catch (error) {
    next(error);
  }
};

export const createPartner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = partnerSchema.parse(req.body);
    const partner = await prisma.partner.create({ data });
    res.status(201).json({ success: true, message: "Partner added successfully", data: partner });
  } catch (error) {
    next(error);
  }
};

export const updatePartner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = partnerSchema.partial().parse(req.body);
    const partner = await prisma.partner.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: "Partner updated successfully", data: partner });
  } catch (error) {
    next(error);
  }
};

export const deletePartner = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.partner.delete({ where: { id } });
    res.json({ success: true, message: "Partner removed successfully" });
  } catch (error) {
    next(error);
  }
};
