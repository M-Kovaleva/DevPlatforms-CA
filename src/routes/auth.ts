import { Router } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database.js";
import { User, UserResponse } from "../interfaces.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Incorrect email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "The password must be at least 6 characters long" });
    }

    // Checking if an email is busy
    const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    const existingUsers = rows as User[];

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "A user with this email already exists" });
    }

    // Hashing the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a user in the database
    const [result] = await pool.execute(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, passwordHash]
    );
    const insertResult = result as ResultSetHeader;

    const userResponse: UserResponse = {
      id: insertResult.insertId,
      email,
    };

    res.status(201).json({
      message: "The user is registered",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;