# 7. User accounts

Our eventual goal is to have a message board that you have to log in to to use.

We're going to approach that goal in 3 steps

1. Defining and storing user accounts
2. Storing and checking passwords
3. Using cookies to define sessions, so we can remember users across requests

This slide is focused on part 1.

Activities

1. Define a users table and associate it with the messages table
2. Allow users to register
3. Look up and store the author of each message when saving them to the database
4. Look up the author of each message when we retrieve them from the database

## Defining a users table

The sqlite module we're using has a tool called 'migrations' that makes defining and manipulating
our schema easier. The concept of a migration is pretty common, it's usually used in the context
of needing to change the shape of your database after there's already data inside it, but for now
we just need a migration to make setting up an empty database more convenient.

Let's define our first migration. Create a folder called `migrations`, and a file inside it
called `001-initial-schema.sql`. Sqlite looks at the numbers at the beginning of the name of the file
and keeps track of the most recent migration it ran. If it finds a file with a larger number, it'll
run that migration.

```SQL
-- Up
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name STRING,
  email STRING UNIQUE
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  authorId INTEGER,
  message STRING,
  FOREIGN KEY(authorId) REFERENCES users(id)
);

-- Down
DROP TABLE users;
DROP TABLE messages;
```

Notice the `-- Up` and `-- Down`. These are actually comments - sqlite uses them specifically
to determine how to perform (up) and undo (down) a migration.

The other new thing about this SQL is `FOREIGN KEY`. Foreign key means "this value will reference the unique identifier of a value in a different table."

Whenever we store a message, we want to store the information of the author who wrote it. We could
store the author's name and email on each message, but we already have a users table, so we're just
going to say "this message was written by this specific user" and store that user's ID.

The last thing we need to do is make sure we run the migration that creates our tables when
the application starts. Go ahead and delete the `dbPromise.then...` call that's in `index.js`
under the dbPromise declaration. We're going to define a function that does all
of our setup in one place.

Add this to the end of `index.js`, replacing `app.listen...`

```javascript
const setup = async () => {
  const db = await dbPromise;
  await db.migrate({ force: "last" });
  app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
  });
};

setup();
```

This ensures that the migration finishes before the server starts listening for requests.
We added `force: "last"` to tell the migration API to roll back and re-apply the latest
migration every time the server starts - which is useful for us while we're developing
and changing our database a bunch. You definitely don't want it to do that in production.

## Allowing users to register

We need routes and a template.

First, the template: create a file `views/register.handlebars`

```HTML
<h1>register for an account</h1>
<form action="register" method="POST">
  <input type="text" name="name" placeholder="name"/>
  <input type="email" name="email" placeholder="email" />
  <button type="submit">register</button>
</form>
```

Next, the routes: add to `index.js`

```javascript
app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { email, name } = req.body;
  await db.run("INSERT INTO users (email, name) VALUES (?,?)", email, name);
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});
```

The GET route handles requests from the browser to see the page, and the POST route
handles requests from the browser when it submits the form

For convenience, let's also add a link to the register page in `views/home.handlebars`. Add this to the bottom

```HTML
<a href="register">register</a>
```

We're not doing any error handling right now, so if you tried to register with an email that was
already registered, it would just crash. We'll get to that later.

## Looking up and storing the author of a message

When we are eventually finished with our implementation, we will have the logged in user's
information available as a field on every request, but since we don't have login yet, we're
going to prompt the user for their email every time they send a message.

We're also going to introduce a way to display errors to the user

First, add an email field to the form that takes messages in `views/home.handlebars`, and
add a way for the template to display error messages

```HTML
<h1>messages</h1>

<ul>
  {{#each messages}}
  <li>{{this.message}} ({{this.id}})</li>
  {{/each}}
</ul>

{{#if error}}
<p style="color: red">{{error}}</p>
{{/if}}
<form method="POST" action="message">
  <input type="email" name="authorEmail" placeholder="Enter your email">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>

<a href="register">register</a>
```

Next, modify the route in `index.js` that accepts messages to also accept and look up the user's email

```javascript
app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message, authorEmail } = req.body;
  const author = await db.get("SELECT * FROM users WHERE email=?", authorEmail);
  if (!author) {
    console.log("notfound");
    const messages = await db.all("SELECT * FROM messages");
    return res.render("home", { messages, error: "user does not exist" });
  }
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    author.id
  );
  res.redirect("/");
});
```

If the user lookup fails, instead of redirecting we simply render the home template
with an error message. This isn't necessarily ideal, because the user sees '/message' in
their address bar and if they refresh the page it will resubmit the form, but it's fine for now

It's also worth noting that we could have done the user lookup in the same query
as the message insertion, but this is only temporary anyway.

## Looking up the message author on retrieval

Let's show a name next to each message instead of a number.

First, modify the template: `views/home.handlebars`

```HTML
<li>{{this.message}} ({{this.author}})</li>
```

Next, we need to write a query with what's called a "join", which will tell SQL to synthesise
our result by combining data from multiple templates.

Here's our index route in `index.js`

```javascript
app.get("/", async (req, res) => {
  const db = await dbPromise;
  const messages = await db.all(
    `SELECT
      messages.id,
      messages.message,
      users.name as author
     FROM messages
     LEFT JOIN users
     WHERE users.id = messages.authorId`
  );
  res.render("home", { messages });
});
```

That's a larger query than we've worked with before, but it reads pretty clearly. It selects the `message` and `id`
from each message, and looks up the `authorId` field in the `users` table, then attaches the
author's `name`, which it calls `author` in our resulting object.

Note that the indentation in the query is completely optional, I've chosen to do so for legibility.

Run the code now. Register, then send a message, and you should see your name next to the message
even though you entered your email in the message form.
