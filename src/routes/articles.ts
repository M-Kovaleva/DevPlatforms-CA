import { Router } from "express";
import { pool } from "../database.js";
import { Article } from "../interfaces.js";

const router = Router();

// GET /articles - public access, no token required, everyone can read
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, body, category, submitted_by, created_at FROM articles ORDER BY created_at DESC"
    );
    const articles = rows as Article[];
    res.json(articles);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Unable to retrieve articles" });
  }
});

export default router;