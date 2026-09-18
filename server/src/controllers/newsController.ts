import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const articleSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().optional().nullable(),
  category: z.enum(["TOURNAMENT", "TEAM", "PLAYER", "COMMUNITY", "ESPORTS"]).default("TOURNAMENT"),
  date: z.string(),
  readTime: z.string().default("3 MIN READ"),
  author: z.string().default("Lordz Editorial"),
  badgeColor: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, featured } = req.query;
    const where: any = { published: true };
    if (category && category !== "ALL") where.category = String(category);
    if (featured !== undefined) where.featured = featured === "true";

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

export const getAllArticlesAdmin = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

export const createArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = articleSchema.parse(req.body);
    const article = await prisma.newsArticle.create({ data });
    res.status(201).json({ success: true, message: "Article published successfully", data: article });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = articleSchema.partial().parse(req.body);
    const article = await prisma.newsArticle.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: "Article updated successfully", data: article });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.newsArticle.delete({ where: { id } });
    res.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    next(error);
  }
};
