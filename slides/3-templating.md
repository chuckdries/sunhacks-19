# 3. getting serious with a templating system

reference branch: `CQ`

In this slide, we're going to introduce a templating system, which allows us to easily generate HTML pages to send as responses to requests.

Activities

1. Replace our simple string responses with full HTML pages
2. Write and serve some simple CSS
3. Build a form in one of our templates that allows the user to enter their name, and use that information to greet them

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

Speaking of our template, let's update that as well

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

Run your code now, and you should see the same thing we saw before. Because we change a template, you'll have to manually stop your code if it's still running.