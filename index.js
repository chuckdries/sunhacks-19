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

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  res.render("home", { messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message, authorEmail } = req.body;
  const author = await db.get("SELECT * FROM users WHERE email=?", authorEmail);
  if (!author) {
    console.log("notfound");
    const messages = await db.all("SELECT * FROM messages");
    return res.render("home", { messages, error: "user does not exist" });
  }
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    author.id
  );
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { email, name } = req.body;
  await db.run("INSERT INTO users (email, name) VALUES (?,?)", email, name);
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

const setup = async () => {
  const db = await dbPromise;
  await db.migrate({ force: "last" });
  app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
  });
};

setup();
