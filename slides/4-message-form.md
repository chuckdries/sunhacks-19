# 4. A form that takes input from users

We're going to use forms with our knowledge of templating to create a page where users
can leave messages for each other

Activities

1. Write a form that sends the user's message to `/message`
2. Add that form to a template
3. Write a route that accepts messages and stores them, we'll call it `/message/`
4. Write a template that can render our messages
5. Write a route that passes all the messages into that template

## A quick primer on HTML forms

HTML has a handful of elements that are interactive. Many of them are variations on
a standard text box and fall under the `input` tag

```HTML
<!-- all of the following render a text box -->
<input type="text" /> <!-- normal text box -->
<input type="password" /> <!-- browsers will show dots instead of letters -->
<input type="email" /> <!-- mobile browsers show a keyboard with an @ symbol on it -->

<!-- other elements -->
<textarea> <!-- resizeable multi-line text input -->
  content inside the textarea by default
</textarea>
<button>
  text inside button
</button>
```

HTML also has an element called `form`, which groups together multiple inputs
and helps us assign functionality to them. Let's jump right into our greeting form

## A form that sends data to our server

Let's start with our greeting form in its entirety, then we can break down how it works

```HTML
<form method="POST" action="message">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>
```

Our input has a `name` attribute. Every input in a form needs one - it associates
the value of the input with a field on the form.

`form` takes two attributes:

1. `method`: the HTTP method to use to send the request
2. `action`: the path to send the data to

When a form sends a GET request (by default), it sends the data over as a query parameter,
which, as we know, are visible in the URL. POST requests, on the other hand, have a body
which is not visible to the user, so we're going to use that. `action` simply
tells the form where to send the request.

We don't have anywhere to put our form quite yet, so let's do that next

## Adding the form to a template

We're going to add this form right to the bottom of our home template, `views/home.handlebars`.

```HTML
<h1>
  hello world!
</h1>
<form method="POST" action="message">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>
```

That's all we need from that for now.

## Writing a route to accept messages

First things first, we don't need our greeting routes anymore. Go ahead and delete both greet
routes from `index.js` (the bits that start with `app.get("/greet...`) and the `views/greet.handlebars` template.

Before we write a route that accepts messages, we need somewhere to put them. Normally you'd use a database,
but for now we're going to use an array. Define an empty array right above the index route (`app.get("/...`)

```javascript
const messages = [];

// app.get("/..... etc. etc.
```

> Note that we made the array a constant. Constant variables aren't immutable, they just can't be reassigned

We also need to be able to get to the body of a POST request. For this, we need a package called [`body-parser`](https://www.npmjs.com/package/body-parser)

```
npm i -s body-parser
```

Body parser is what express calls a "middleware", which just means it intercepts a request, does something, then
passes it along to the next thing, until finally the request makes it to your route. We need to tell
express to use it. Require it at the top of the file, then hook it up right above
(or below, in this case it doesn't matter) our static middleware.

```javascript
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");

// ...

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

// ...
```

Finally, with a middleware to parse our messages and a place to put them, let's add our route below the index route.
Add this to `index.js`, above the `app.listen` call

```javascript
app.post("/message", (req, res) => {
  const message = req.body.message;
  messages.push(message);
  res.redirect("/");
});
```

We used app.post to respond to post requests just like we used app.get to respond to get requests earlier. In this route, instead of rendering something, we're going to redirect the user back to the homepage. Messages.push just adds a new item to the messages array. We could render something, but in this case we're going to be showing both the message list and the message form on the homepage

## Rendering messages in a template

Let's throw the messages into our homepage template so you can see them and send them all in the same place. Handlebars has
a concept called "helpers" - we've already used the `#if` helper, now we're going to use the `#each` helper to render
multiple similar things from a list. Edit `home.handlebars` so that it looks like this:

```HTML
<h1>messages</h1>

<ul>
    {{#each messages}}
    <li>{{this}}</li>
    {{/each}}
</ul>

<form method="POST" action="message">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>
```

You can think of the each helper sort of like a for loop.
"For each message in the messages array, render a `<li>` and put the contents of the message inside of it."

That's it for our template

## Passing messages into a template

All that's left is to have our index route pass messages into the template. Modify the `"/"` route `index.js` like so

```javascript
app.get("/", (req, res) => {
  res.render("home", { messages: messages });
});
```

That's it! If you run your code, you should see a form with a message box, and when you type a
message into it and hit enter, it should appear above the form!
