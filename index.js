import express from "express";
import hbs from "express-handlebars";
import { getTimer } from "./utils";
import sqlite from "sqlite";

const app = express();
const dbPromise = sqlite.open("./database.sqlite");

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

// app.use(bodyParser({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all(
    "SELECT messages.message, users.name as author FROM messages LEFT JOIN users WHERE users.id = messages.authorId"
  );
  res.render("home", { messages });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { authorEmail, message } = req.body;
  const result = await db.run(
    "INSERT INTO messages (authorId, message) SELECT  users.id, ? FROM users WHERE users.email = ?",
    message,
    authorEmail
  );
  console.log(result.stmt.changes);
  res.redirect("/");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { email, name } = req.body;
  await db.run("INSERT INTO users (email, name) VALUES (?, ?)", email, name);
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
