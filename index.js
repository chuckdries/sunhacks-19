// index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/greet/:name", (req, res) => {
  const name = req.params.name;
  res.send(`Hello ${name}! Welcome to your page`);
});

app.get("/greet", (req, res) => {
  const name = req.query.name;
  if (name) {
    res.send(`Hello ${name}!`);
  } else {
    res.send("Well this is awkward... I don't know who you are");
  }
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
