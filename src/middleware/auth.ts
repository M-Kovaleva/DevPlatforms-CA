import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

// JWT token verification middleware
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Checking if there is an authorization header at all
  if (!authHeader) {
    return res.status(401).json({ error: "An access token is required" });
  }

  // Checking the "Bearer <token>" format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "The token must be in the format: Bearer <token>" });
  }

  // Take out the token itself (cut off the "Bearer")
  const token = authHeader.substring(7);

  // Checking the token
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(403).json({ error: "The token is invalid or has expired" });
  }

  // Put the user ID in req so that the routes can use it
  req.user = { id: payload.userId };
  next();
};