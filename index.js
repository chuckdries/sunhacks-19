const express = require("express");
const hbs = require("express-handlebars");

const app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/public", express.static("public"));

app.get("/greet", (req, res) => {
  const name = req.query.name;
  res.render("greet", { name });
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
