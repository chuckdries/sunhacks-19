const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/public", express.static("./public"));

// index route
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/greet", (req, res) => {
  const name = req.query.name;
  res.render("greet", { name: name });
});

app.listen(3000, function() {
  console.log("listening on http://localhost:3000");
});

// () => {}
// function() {}
