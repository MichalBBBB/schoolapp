import "dotenv-safe/config";
import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello world");
});

app.get("/test", (_req, res) => {
  res.send("Chod do pice hotdog");
});

app.get("/apple-app-site-association", (_req, res) => {
  res.json({
    webcredentials: {
      apps: ["AZLX5H46ZL.app.dayto.dayto"],
    },
  });
});

app.listen(process.env.PORT, () => {
  console.log("Web running on localhost:" + process.env.PORT);
});
