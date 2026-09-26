import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { getCache, setCache, delCache } from "../config/cache.js";

const partnerSchema = z.object({
  name: z.string().min(1),
  category: z.string().default("Gaming"),
  tier: z.string().default("OFFICIAL PARTNER"),
  logoImage: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  cardImage: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

const DEFAULT_FALLBACK_PARTNERS = [
  { id: "esports-pro", name: "ESPORTS PRO", tier: "MAIN SPONSOR", category: "Tournament Platform", logoImage: "/uploads/logo-esportspro-clean.svg", websiteUrl: "https://esportspro.gg", sortOrder: 1, isActive: true },
  { id: "espotz-live", name: "ESPOTZ LIVE", tier: "BROADCAST PARTNER", category: "Livestream Production", logoImage: "/uploads/logo-espotz-clean.svg", websiteUrl: "https://espotz.live", sortOrder: 2, isActive: true },
  { id: "infinix", name: "INFINIX", tier: "MAIN SPONSOR", category: "Official Gaming Smartphone", logoImage: "/uploads/logo-infinix-clean.svg", websiteUrl: "https://infinixmobility.com", sortOrder: 3, isActive: true },
  { id: "free-fire-max", name: "FREE FIRE MAX", tier: "OFFICIAL TITLE", category: "Official Battle Royale Title", logoImage: "/uploads/logo-freefire-clean.svg", websiteUrl: "https://ff.garena.com", sortOrder: 4, isActive: true },
  { id: "fusion-crystals", name: "FUSION CRYSTALS", tier: "OFFICIAL PARTNER", category: "Energy & Performance", logoImage: "/uploads/logo-fusion-clean.svg", websiteUrl: "https://fusioncrystals.gg", sortOrder: 5, isActive: true },
  { id: "esports-world-cup", name: "ESPORTS WORLD CUP", tier: "GLOBAL ALLIANCE", category: "Global Competitive Circuit", logoImage: "/uploads/logo-ewc-clean.svg", websiteUrl: "https://esportsworldcup.com", sortOrder: 6, isActive: true },
];

export const getPartners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Check Redis / Memory cache first for lightning-fast sub-millisecond response
    const cacheKey = "api:partners:active";
    const cached = await getCache<any[]>(cacheKey);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      res.setHeader("X-Cache", "HIT-REDIS");
      res.json({ success: true, data: cached });
      return;
    }

    // 2. Fetch from DB
    let partners: any[] = [];
    try {
      partners = await prisma.partner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch (dbErr) {
      console.warn("⚠️ [getPartners] Database query error, using static fallback:", dbErr);
    }

    if (!partners || partners.length === 0) {
      partners = DEFAULT_FALLBACK_PARTNERS;
    }

    // 3. Store in Redis/memory cache with 10-minute TTL
    await setCache(cacheKey, partners, 600);
    res.setHeader("X-Cache", "MISS");
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
    const body = { ...req.body };
    if (!body.logoImage && body.logo) body.logoImage = body.logo;
    if (!body.websiteUrl && body.website) body.websiteUrl = body.website;

    const data = partnerSchema.parse(body);
    const { logo, website, ...prismaData } = data as any;
    if (!prismaData.logoImage && logo) prismaData.logoImage = logo;
    if (!prismaData.websiteUrl && website) prismaData.websiteUrl = website;

    const partner = await prisma.partner.create({ data: prismaData });

    // Invalidate Redis caches
    await delCache("api:partners*");
    await delCache("http:*partners*");

    res.status(201).json({ success: true, message: "Partner added successfully", data: partner });
  } catch (error) {
    next(error);
  }
};

export const updatePartner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (!body.logoImage && body.logo) body.logoImage = body.logo;
    if (!body.websiteUrl && body.website) body.websiteUrl = body.website;

    const data = partnerSchema.partial().parse(body);
    const { logo, website, ...prismaData } = data as any;
    if (!prismaData.logoImage && logo) prismaData.logoImage = logo;
    if (!prismaData.websiteUrl && website) prismaData.websiteUrl = website;

    const partner = await prisma.partner.update({
      where: { id },
      data: prismaData,
    });

    // Invalidate Redis caches
    await delCache("api:partners*");
    await delCache("http:*partners*");

    res.json({ success: true, message: "Partner updated successfully", data: partner });
  } catch (error) {
    next(error);
  }
};

export const deletePartner = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.partner.delete({ where: { id } });

    // Invalidate Redis caches
    await delCache("api:partners*");
    await delCache("http:*partners*");

    res.json({ success: true, message: "Partner removed successfully" });
  } catch (error) {
    next(error);
  }
};
