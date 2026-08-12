import express from "express";
import cors from "cors";
import { pool } from "./database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "News API works!" });
});

interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, email, created_at FROM users");
    const users = rows as Omit<User, "password_hash">[];
    res.json(users);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.listen(PORT, () => {
  console.log(`Server works on ${PORT} port`);
});