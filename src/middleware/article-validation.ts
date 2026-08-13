import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const articleSchema = z.object({
  title: z
    .string()
    .min(3, "The title must be at least 3 characters long")
    .max(255, "The title must not exceed 255 characters"),
  body: z.string().min(10, "The text of the article must be at least 10 characters long"),
  category: z
    .string()
    .min(2, "Category must be at least 2 characters long")
    .max(100, "The category must not exceed 100 characters"),
});

export const validateArticle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = articleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation error",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  next();
};