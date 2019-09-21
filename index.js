// index.js
import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";

import { getPromiseTimer } from "./utilities/promiseTimer";

getPromiseTimer(300, "howdy").then(value => {
  console.log("used .then: " + value);
});

const asyncTest = async () => {
  const yoTimer = getPromiseTimer(1000, "yo");
  const greeting = await yoTimer;
  console.log("used await: " + greeting);
};

asyncTest();

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
