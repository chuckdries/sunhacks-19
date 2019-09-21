const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite = require("sqlite");

const dbPromise = sqlite.open("./database.sqlite");
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("./public"));

// index route
app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  res.render("home", { messages }); // { messages: messages }
});

app.post("/message", async (req, res) => {
  const message = req.body.message;
  const db = await dbPromise;
  await db.run("INSERT INTO messages (message) VALUES (?)", message);
  res.redirect("/");
});

const setup = async () => {
  const db = await dbPromise;
  await db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    message STRING
  );`);
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
