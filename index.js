const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("./public"));

const messages = [];
// index route
app.get("/", (req, res) => {
  res.render("home", { messages }); // { messages: messages }
});

app.post("/message", (req, res) => {
  const message = req.body.message;
  messages.push(message);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("listening on http://localhost:3000");
});

// () => {}
// function() {}
