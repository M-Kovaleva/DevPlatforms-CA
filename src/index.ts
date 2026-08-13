import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import articleRoutes from "./routes/articles.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "News API works!" });
});

// Connecting the routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);

// 404 handler - catches requests to routes that don't exist (must go AFTER all routes)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware - catches all unhandled errors (must be LAST)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server works on ${PORT} port`);
});