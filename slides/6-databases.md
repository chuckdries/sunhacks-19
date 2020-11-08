# 6. Connecting to a database

You may have noticed that our message board loses all of its messages every time we restart the server.
This simply will not do - we need to store the messages somewhere safe.

Activities:

1. Define a very simple database schema
2. Store messages in the database when we receive them
3. Retrieve messages from the databases when we need to

## Defining a database

SQL databases are made up of tables kind of like a collection of spreadsheets. Every table in a SQL
database needs to have a field (or multiple) that uniquely identifies each row from the others. This
field is the "primary key". Our first database is going to be really really simple, just a single table
of messages, with a field for the message text and an id field to use as the primary key.

It's worth noting that different SQL databases sometimes implement the language differently, with
different features and syntax.

We're going to be using a flexible and lightweight SQL implementation called SQLite. Most SQL
databases are separate servers that your application must connect to, but SQLite runs alonside your
code and stores the entire database in a single file.

Let's install [`sqlite`](https://www.npmjs.com/package/sqlite)

```
npm i -s sqlite
```

In `index.js`, import it

```javascript
import sqlite3 from "sqlite3";
import { open } from "sqlite";
```

Somewhere near the top of `index.js`, open a database file
(it will be created if it doesn't exist)

```javascript
const dbPromise = open({
  filename: "./database.sqlite",
  driver: sqlite3.Database,
});
```

`dbPromise` is a promise that represents access to our database. It's a promise because it
needs to access the disk to interact with the database, thus it's something you might need
to wait for

Before we move on, let's add the database to our `.gitignore`

```
node_modules
database.sqlite
```

Now that we have a way to interact with our database, lets set up our one and only table

The SQL code to define our table is

```SQL
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  message STRING
);
```

We're going to do that as soon as the database is ready. The promise resolves to the sqlite
instance, so we can just do something like this

```javascript
const dbPromise = open({
  filename: "./database.sqlite",
  driver: sqlite3.Database,
}); // was already here
dbPromise.then((db) => {
  db.run(`CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY,
    message STRING
  )`);
});
```

I've added 'IF NOT EXISTS' because we're indiscriminately running this every time the server
starts, and it'll normally error if the table already exists. We'll come back to that

## Storing messages in the database

Let's update our `"/message"` route to write to the database

```javascript
app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message } = req.body;
  await db.run("INSERT INTO messages (message) VALUES(?)", message);
  res.redirect("/");
});
```

The statement inside of db.run is about as simple as SQL inserts get. Note the question mark -
the sqlite package we're using will replace question marks with arguments we pass after the statement.
We could have used string concatenation to simply insert the message into the string, but that's
considered unsafe. This way, sqlite will "sanitize" our input for us.

Note that we're only setting the message, not the ID. SQLite will automatically increment a
field that is marked as `INTEGER PRIMARY KEY` you don't set it. It will ensure the value
is unique without any extra effort from us.

## Retrieving messages from the databases

Now we need to update our home route to get messages from the database instead of our array

```javascript
app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all("SELECT * FROM messages");
  res.render("home", { messages });
});
```

This pulls our messages from the database, but now it'll be an array of objects (with an `id` and a `message`)
instead of an array of strings like it was before. We need to update our `views/home.handlebars` template

Also go ahead and delete the messages array if you haven't already

```HTML
<h1>messages</h1>

<ul>
  {{#each messages}}
  <li>{{this.message}} ({{this.id}})</li>
  {{/each}}
</ul>

<form method="POST" action="message">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>
```

I went ahead and made it also render the ID in parenthesis after the message, just so we can see
what the value is.
