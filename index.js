// index.js
import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import sqlite from "sqlite";

const dbPromise = sqlite.open("./database.sqlite");
const app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

dbPromise.then(db => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    message STRING
  )`);
});

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  res.render("home", { messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message } = req.body;
  await db.run("INSERT INTO messages (message) VALUES (?)", message);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
