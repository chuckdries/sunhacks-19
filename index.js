import express from "express";
import hbs from "express-handlebars";
import bodyParser from "body-parser";
import { getTimer } from "./utils";

const app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");

app.use(bodyParser());
app.use("/public", express.static("public"));

const messages = ["hello there", "howdy"];

// promises represent a value that might not exist yet
// getTimer returns a promise that "resolves" with a "value" after a set number of milliseconds
const helloTimer = getTimer(3000, "hello");
console.log("hello timer is:", helloTimer);
// you attach a function to a promise with `.then` to tell node to call that function with the value when the promise resolves
helloTimer.then(value => console.log("hello timer's value is:", value));

// you can also use promises in 'async' functions
app.get("/", async (req, res) => {
  // where you merely need to 'await' them, which tells node to pause the function until the promise resolves
  // here, we're using our promise timer to pretend that it takes a long time to retreive the messages from a hypothetical database
  const msgs = await getTimer(2000, messages);
  res.render("home", { messages: msgs });
});

app.post("/message", (req, res) => {
  const message = req.body.message;
  messages.push(message);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
