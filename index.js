import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import { getTimer } from "./utils";
import sqlite from "sqlite";

const app = express();
const dbPromise = sqlite.open("./database.sqlite");

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

app.use(bodyParser({ extended: false }));
app.use("/public", express.static("public"));

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  console.log("messages", messages);
  res.render("home", { messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const message = req.body.message;
  await db.run("INSERT INTO messages (message) VALUES (?)", message);
  res.redirect("/");
});

const setup = async () => {
  const db = await dbPromise;
  await db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    message STRING NOT NULL
  )`);
  app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
  });
};

setup();
