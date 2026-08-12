import { Router } from "express";
import { pool } from "../database.js";
import { User } from "../interfaces.js";

const router = Router();

// GET /users - list of users (without password_hash)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, email, created_at FROM users");
    const users = rows as Omit<User, "password_hash">[];
    res.json(users);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;