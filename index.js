// index.js
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");

const app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

const messages = [];

app.get("/", (req, res) => {
  res.render("home", { messages: messages });
});

app.post("/message", (req, res) => {
  const message = req.body.message;
  messages.push(message);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
