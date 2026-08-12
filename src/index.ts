import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "News API works!" });
});

// Connecting the routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server works on ${PORT} port`);
});