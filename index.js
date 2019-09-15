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
  const [messages, users] = await Promise.all([
    db.all("SELECT * FROM messages"),
    db.all("SELECT * FROM users")
  ]);
  console.log("messages", messages);
  res.render("home", { messages, users });
});

app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { authorId, message } = req.body;
  await db.run(
    "INSERT INTO messages (authorId, message) VALUES (?, ?)",
    authorId,
    message
  );
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
