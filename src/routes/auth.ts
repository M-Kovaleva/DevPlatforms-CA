import { Router } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database.js";
import { User, UserResponse } from "../interfaces.js";
import { generateToken } from "../utils/jwt.js";
import { validateRegistration, validateLogin } from "../middleware/auth-validation.js";

const router = Router();

router.post("/register", validateRegistration, async (req, res) => {
  try {
    const { email, password } = req.body;

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

router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Searching for a user by email
    const [rows] = await pool.execute(
      "SELECT id, email, password_hash FROM users WHERE email = ?",
      [email]
    );
    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    const user = users[0];

    // Сверяем пароль с хешем
    const validPassword = await bcrypt.compare(password, user.password_hash!);

    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    // Generating a JWT token
    const token = generateToken(user.id);

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

export default router;