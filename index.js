const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");

const saltRounds = 10;

const dbPromise = sqlite.open("./database.sqlite");
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("./public"));

const checkAuth = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return next();
  }
  const db = await dbPromise;
  const session = await db.get(
    "SELECT * FROM sessions WHERE token=?",
    accessToken
  );
  if (!session) {
    return next();
  }
  const user = await db.get(
    "SELECT name, email, id FROM users WHERE id=?",
    session.userId
  );
  if (!user) {
    return next();
  }
  req.user = user;
  next();
};

app.use(checkAuth);
// index route
app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all(
    `SELECT messages.message, messages.id, users.name as author 
      FROM messages 
      LEFT JOIN users 
      WHERE users.id=messages.authorId`
  );
  res.render("home", { messages, user: req.user });
});

app.post("/message", async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  const { message } = req.body;
  const db = await dbPromise;
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    req.user.id
  );
  res.redirect("/");
});

app.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("register");
});

app.post("/register", async (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  const db = await dbPromise;
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  const result = await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    name,
    email,
    hashedPassword
  );
  const id = result.stmt.lastID;
  console.log(id);
  const accessToken = uuid();
  await db.run(
    "INSERT INTO sessions (token, userId) VALUES (?, ?)",
    accessToken,
    id
  );
  const sessions = await db.all("SELECT * FROM sessions");
  console.log(sessions);
  res.cookie("accessToken", accessToken);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("login");
});

app.post("/login", async (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  const db = await dbPromise;
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", email);
  if (!user) {
    res.render("login", { error: "user not found" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.render("login", { error: "invalid password" });
  }
  const accessToken = uuid();
  await db.run(
    "INSERT INTO sessions (token, userId) VALUES (?, ?)",
    accessToken,
    user.id
  );
  const sessions = await db.all("SELECT * FROM sessions");
  console.log(sessions);
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

// app.listen(3000, function() {
//   console.log("listening on http://localhost:3000");
// });

// () => {}
// function() {}
