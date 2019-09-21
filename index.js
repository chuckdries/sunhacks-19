// index.js
import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import sqlite from "sqlite";
import bcrypt from "bcrypt";
import uuid from "uuid/v4";

const saltRounds = 10;
const dbPromise = sqlite.open("./database.sqlite");
const app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all(
    `SELECT messages.id, messages.message, users.name as author FROM messages
     LEFT JOIN users
     WHERE users.id = messages.authorId`
  );
  res.render("home", { messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message } = req.body;
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    author.id
  );
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  const result = await db.run(
    "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
    email,
    name,
    hashedPassword
  );
  const accessToken = uuid();
  await db.run(
    "INSERT INTO sessions (userId, token) VALUES (?, ?)",
    result.stmt.lastID,
    accessToken
  );
  res.cookie("accessToken", accessToken);
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", email);
  if (!user) {
    return res.render("login", { error: "user does not exist" });
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.render("login", { error: "password is wrong" });
  }
  const accessToken = uuid();
  await db.run(
    "INSERT INTO sessions (userId, token) VALUES (?, ?)",
    user.id,
    accessToken
  );
  res.cookie("accessToken", accessToken);
  res.redirect("/");
});

const setup = async () => {
  const db = await dbPromise;
  await db.migrate({ force: "last" });
  app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
  });
};

setup();
