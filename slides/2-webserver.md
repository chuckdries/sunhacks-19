# A Basic Webserver

reference branch: `prep/hello-world-webserver`

In this slide, we're going to be introduced to Express, which will allow us to respond to HTTP requests

Activities

1. Write a webserver that responds to requests with "hello, world"
2. Update the webserver to greet visitors by name via route parameter
3. Update the webserver to greet visitors by name via query parameter

## A quick primer on HTTP

1. You type in a website
2. Your web browser makes a request to that website
3. The website responds with some content (or maybe an error)

HTTP requests have a method, a path, some headers, and sometimes a body.

Methods:

- `GET` - does not have a body
- `POST` - has a body
- `DELETE` - does not have a body
- There are a few others but they don't matter for now

If you go to `http://sunhacks.io/`, your browser makes a `GET` request to the path `/`.

## Installing express

We'll be using NPM to install express and other packages. It puts all that code in a folder called `node_modules`. We don't want `node_modules` in our repo because it can get really big, and since we record all of the things we install in `package.json`, it's super easy for other people to install everything for themselves.

To instruct git to ignore the `node_modules` folder, create a file called `.gitignore`, and put this in it.

```
node_modules
```

It's just one line for now, but it will grow as our project grows more complex.

Next, install express

```
npm install --save express
```

You'll see a `node_modules` folder now exists. The `--save` flag instructed npm to save express to a section called `dependencies` in our `package.json` file. In the future, if other people download your code, they can run `npm install` to let npm read your package.json and install this project's dependencies automatically. Don't ever forget to use `--save` when adding a new package.

## The hello world webserver

First, clear out the `index.js` file.

Then, add this line to the top:

```js
const express = require("express");
```

This is how we reference external code in our node projects. There are actually other ways to reference external code 
(some tutorials you find may use an `import` statement, for example), but we won't go over those now.

Next, we need to create an express instance

```js
const app = express();
```

The express instance represents your webserver. We're folloing the [official express hello world tutorial](https://expressjs.com/en/starter/hello-world.html) right now.

Add a route

```javascript
app.get("/", (req, res) => {
  res.send("hello world");
});
```
This registers a function that express will call when it gets a `GET` request to the root url, `/`.

Finally, we need to tell our app to listen for requests

```javascript
app.listen(3000, () => {
  console.log("listening on http://localhost:300");
});
```

this just starts our webserver, and logs a message when it comes up. `localhost` in a url just means "this computer", and the number 3000 is the port.

Run `npm run start`, then go to http://localhost:3000 in your browser, and you should see "hello world"

If you go to http://localhost:3000/foo in your browser, you should get a 404 error, because we're only handling the `/` route

Our webserver should now look like this

```javascript
// index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
```

## A webserver that greets people by name

reference branch: `prep/greeting-webserver`

We're going to look at two ways of dynamically pulling information from the URL itself.

### Route parameters

Express's router has the ability to leave placeholders in the route when we register the handler, which it will fill in with data from the url that the user visits.

Let's add a handler to greet someone by name. Add this above the `app.listen` call.

```javascript
app.get("/greet/:name", (req, res) => {
  const name = req.params.name;
  res.send(`Hello ${name}! Welcome to your page`);
});
```

When the user visits http://localhost:3000/greet/chuck, for example, express picks out 'chuck' and gives it to us as `req.params.name`. Pretty straightforward. If you haven't already, stop your webserver with `ctrl + c`, then start it with `npm run start` again, and try your new greet route with different names. Every time we make a change to the code, you'll need to stop and start your webserver. From now on I won't be explicity saying that.

You may have noticed that `/greet/` with no name doesn't work. That's because the name parameter must be present for the handler above to be called. Let's add a greet route that does not use a route parameter.

### Query parameters

Query parameters are key value pairs appended to the end of a URL after a question mark. They're a way to store data in the URL without changing the path. We're going to make a route at `greet` that works with or without being given a name.

```javascript
app.get("/greet", (req, res) => {
  const name = req.query.name;
  if (name) {
    res.send(`Hello ${name}!`);
  } else {
    res.send("Well this is awkward... I don't know who you are");
  }
});
```

Try hitting `/greet` now. You should get the no name message. To add a name, try this: http://localhost:3000/greet?name=chuck. We separate the path from the query string by a question mark, then we just say `name=chuck`

The decision to use query params vs route params is pretty situational, don't worry too much about it now.

Let's move on to making something that looks nicer
