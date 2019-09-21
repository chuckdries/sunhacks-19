const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const dbPromise = sqlite.open("./database.sqlite");
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("./public"));

// index route
app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  res.render("home", { messages }); // { messages: messages }
});

app.post("/message", async (req, res) => {
  // const message = req.body.message;
  // const authorEmail = req.body.authorEmail;
  // const authorPassword = req.body.authorPassword;
  const { message, authorEmail, authorPassword } = req.body;
  const db = await dbPromise;
  const author = await db.get("SELECT * FROM users WHERE email=?", authorEmail);
  if (!author) {
    return res.redirect("/");
  }
  const isPasswordValid = await bcrypt.compare(authorPassword, author.password);
  if (!isPasswordValid) {
    return res.redirect("/");
  }
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    author.id
  );
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    name,
    email,
    hashedPassword
  );
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
