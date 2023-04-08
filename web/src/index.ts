import "dotenv-safe/config";
import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.get("/test", (_req, res) => {
  res.send("Chod do pice hotdog");
});

app.listen(process.env.PORT, () => {
  console.log("Web running on localhost:" + process.env.PORT);
});
