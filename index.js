const express = require("express");
const app = express();

// // examples of function definitions
// function add(x, y) {
//   return x + y;
// }

// const subtract = function(x, y) {
//   return x - y;
// };

// const multiply = (x, y) => {
//   return x * y;
// };

// const divide = (x, y) => x / y;

app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});

app.get("/greet", (req, res) => {
  const name = req.query.name;
  console.log(req.query);
  res.send(`<h1>hello via query, ${name}!`);
});

app.get("/greet/:name", (req, res) => {
  const name = req.params.name;
  res.send(`<h1>hello via param, ${name}!`);
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
