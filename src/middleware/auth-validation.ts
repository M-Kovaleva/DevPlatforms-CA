import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Registration scheme: email + complex password
export const registerSchema = z.object({
  email: z.email("The email must be in the correct format"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "The password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character"
    ),
});

// Login scheme: email + password
export const loginSchema = z.object({
  email: z.email("The email must be in the correct format"),
  password: z.string(),
});

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation error",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation error",
      details: result.error.issues.map((issue) => issue.message),
    });
  }

  next();
};