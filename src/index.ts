import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "News API works!" });
});

app.listen(PORT, () => {
  console.log(`Server works on ${PORT} port `);
});