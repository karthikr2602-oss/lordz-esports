import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().positive(),
  originalPrice: z.number().optional().nullable(),
  stock: z.number().int().default(100),
  category: z.enum(["JERSEY", "HOODIE", "ACCESSORY"]).default("JERSEY"),
  sizes: z.string().default("[\"S\",\"M\",\"L\",\"XL\",\"2XL\"]"),
  frontImage: z.string().optional().nullable(),
  backImage: z.string().optional().nullable(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(true),
});

export const getProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: "Product updated successfully", data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
