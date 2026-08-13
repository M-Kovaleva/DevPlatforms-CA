import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database.js";
import { Article } from "../interfaces.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateArticle } from "../middleware/article-validation.js";

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

// POST /articles - secure route, only for logged in users
router.post("/", authenticateToken, validateArticle, async (req, res) => {
  try {
    const { title, body, category } = req.body;

    // req.user was introduced thanks to authenticateToken
    const submittedBy = req.user!.id;

    const [result] = await pool.execute(
      "INSERT INTO articles (title, body, category, submitted_by) VALUES (?, ?, ?, ?)",
      [title, body, category, submittedBy]
    );
    const insertResult = result as ResultSetHeader;

    res.status(201).json({
      message: "The article created",
      article: {
        id: insertResult.insertId,
        title,
        body,
        category,
        submitted_by: submittedBy,
      },
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

export default router;