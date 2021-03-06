# 3. getting serious with a templating system

reference branch: `CQ`

In this slide, we're going to introduce a templating system, which allows us to easily generate HTML pages to send as responses to requests.

Activities

1. Replace our simple string response with a full HTML page rendered from a template
2. Write and serve some simple CSS

## A quick primer on HTML

HTML is a language that describes the content of websites. Every website is made of HTML.
HTML made up of tags, which look
like `<this>` (and sometimes have a closing tag like `</this>`) represent things like
paragraphs and boxes. Below is a simple HTML page that says "Hello" in really big text

```html
<html>
  <head>
    <title>Our test page</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

Every HTML page is wrapped in a tag called HTML and has a `head`, which is always invisible and contains
information about the page, and a tag called `body`, which contains the things you actually see on the page.

- `h1` is the biggest 'header' tag. There are others - `h2` is smaller, `h3` smaller than that...
- `title` is the name of the page that shows up in the tab

## Installing a template engine

At its most basic, a template system will allow us to write HTML files with placeholders in them, and then fill those
placeholders with content later. There are plenty of template systems out there, the [express wiki contains a whole list of em](https://expressjs.com/en/resources/template-engines.html). We're
going to use one called handlebars because I like it. The package that lets us use handlebars in express is called
`express-handlebars`. Let's install it now.

```
npm i -s express-handlebars
```

Note the shorthand syntax I used here. `npm i` is short for `npm install`, and `-s` is short for `--save`

Let's also install and configure something to make our lives easier later.

```
npm i -D nodemon
```

The flag `-D`, which is short for `--save-dev`, indicates to npm that we need this dependency while we're developing the project,
but it's not necessary to run the final product. Nodemon is simply a tool that runs our code and restarts it automatically when
we make changes to our code. It's a drop in replacement for the `node` command we're using in our start script now. Let's
replace it. Change the start script in your `package.json` to look like this.

```
"scripts": {
  "start": "nodemon index.js"
}
```

Now, when we run `npm run start`, it'll restart our code automatically when it detects changes
(note that it can't detect when we change our template files, only when we change our javascript files)

Ok, let's wire up express to use our template engine!

First, let's import express-handlebars and tell express that we want to use it. The setup code is straight from the [express-handlebars documentation](https://www.npmjs.com/package/express-handlebars). Some templating libraries may be slightly different.

```javascript
// index.js
const express = require("express");
const hbs = require("express-handlebars");

const app = express();

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
```

## Setting up and using our first template

Express expects you to put your template in a folder called `views`, make one now. In it, make a new file
called `home.handlebars`. This will be our main template. Let's put some content in it:

```HTML
<html>
  <head>
    <title>Hello world page</title>
  </head>
  <body>
    <h1>Hello there</h1>
  </body>
</html>
```

Then, in `index.js`, update your index route (the one that responds to "`\`") to render the template:

```javascript
app.get("/", (req, res) => {
  res.render("home", { layout: false });
});
```

Note the second parameter to the render call - it's an object with a single key in it, `layout`, which is set to `false`.
The object you pass into res.render always gets passed along to the templating system. Normally, you use it to inject data
into templates (which we'll get to), but express-handlebars has a feature called "layouts", which are ways to share common code
between many similar templates, and it uses the layout value to control that. We're setting it to "false" because we haven't
set up any layouts yet.

Run your code and see our bold, beautiful webpage!

Now, let's make a layout and get some data into our templates.

Make a `layouts` folder **in the `views` folder** and make a new file called `main.handlebars` inside it. Fill it out like so

```HTML
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  {{{ body }}}
</body>

</html>
```

This is a standard scaffold for a webpage. Don't worry too much about what those extra tags do. If you're using vscode, type an exclamation mark then press tab to generate this code for you.

Note the `{{{ body }}}`. This is our first placeholder. express-handlebars will replace it with the html that comes out of the template we render from `res.render`.

Speaking of our template, let's update `views/home.handlebars` as well

```HTML
<h1>Hello there</h1>
```

We don't need the rest of the code that was there anymore - we moved it to the layout.

Finally, remove the `template: false` instruction from our render call in `index.js`

```javascript
app.get("/", (req, res) => {
  res.render("home");
});
```

Run your code now, and you should see the same thing we saw before.
Because we change a template, you'll have to manually stop your code if it's still running.

Finally, we want to style our page. This is done with a language called CSS. We could put all our CSS in our template file, but that will
quickly grow unweildly as our project grows, so we want to write our styles in dedicated CSS files. HTML has a way of linking to external
stylesheets built in, so all we need to do is make sure they're accessible

First, make a folder called `public`.

Next, add this code to `index.js` to tell express to serve the contents of `public` so our users' browsers can get to the files inside it.
I put this code below `app.set` but before the first `app.get`, but you can put it anywhere below `const app = express()`

```javascript
app.use("/public", express.static("public"));
```

It's worth noting that express will serve anything you put in the public directory now, so if we need images for our pages, for example,
we can put them there as well as stylesheets. Let's make our first stylesheet not

Make a new file inside of `public` called `index.css`, and fill it with content.

```CSS
body {
  max-width: 500px;
  margin: auto;
  margin-top: 1em;
  background: #eee;
  color: #333;
}
```

CSS is sort of out of scope for now, but like everything we're learning today, there are fantastic resources available online.

Finally, let's link our CSS file in our layout. Add the following to the `head` section of `views/layouts/main.handlebars`

```HTML
  <link rel="stylesheet" href="public/index.css">
```

When the browser sees that line, it will try to download `http://localhost:3000/public/index.css`.

Now, run the code. It should look a little better now.

## Injecting data into a template

Let's take another look at our greeting route. It takes in a name, and says hello. Let's make a template
to say hello _with style_.

Make a file in `views` called `greet.handlebars`, and fill it out like so:

```HTML
{{#if name}}
<h1>Hello there, {{ name }} </h1>
{{else}}
<h1>Well this is awkward... I don't know who you are</h1>
{{/if}}
<h1>
```

Now, in `index.js`, wire up the template to our greet routes

```javascript
app.get("/greet/:name", (req, res) => {
  const name = req.params.name;
  res.render("greet", { name: name });
});

app.get("/greet", (req, res) => {
  const name = req.query.name;
  // { name } is shorthand for { name: name }
  res.render("greet", { name });
});
```

As we briefly touched on earler, that second parameter we pass to `res.render` is an object. In this case,
it has a field called `name`, which has the value of the `name` variable. The fields ("keys" in javascript speak)
determine which variables exist in the template.

Notice how we removed the "null checking" (making sure a value exists) from the route
to the template. We didn't have to do this, but I wanted to show you how if statements work in handlebars.

In our next slide, we're going to look at HTML forms and start building our message board
