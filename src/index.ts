import express, { Express } from "express";

const app: Express = express();

app.get("/", (req, res) => {
  res.json({ app: "hi" });
});

app.listen(3000, () => {
  console.log("App running");
});
