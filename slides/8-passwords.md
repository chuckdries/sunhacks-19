# 8. Passwords

Our current implementation doesn't have a way of verifying who is sending a message, it just trusts
that you typed your email and not somebody else's. Allowing users to impersonate other users is bad,
so we're going to ask users to set a password and enter it when they want to send a message.

Activities

1. Ask users to set their password when they register
2. Verify their password when they send a message

## Collecting and storing passwords

Let's add a password field to `views/register.handlebars`, and while we're here, let's throw
in some error handling as well

```HTML
<h1>register for an account</h1>
{{#if error}}
<p>{{error}}</p>
{{/if}}
<form action="register" method="POST">
  <input type="text" name="name" placeholder="name" />
  <input type="email" name="email" placeholder="email" />
  <input type="password" name="password" placeholder="password" />
  <button type="submit">register</button>
</form>
```

Add a field for it in the database in `migrations/001-initial-schema.sql`

```SQL
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name STRING,
  email STRING UNIQUE,
  password STRING
);
```

If we're going to store someone's password, we need to hash it. That means we're going to do some
irreversible thing to it, so that the original password cannot be derived from the thing that we store.
It's really important that there's absolutely no way to figure out what a user's password actually is
just by looking at the database. When it comes time to check if they entered the right password,
we run that password through the same hashing algorithm and see if the output is the same. That
way we never need to know what the password actually is

> NEVER EVER EVER STORE THE USER'S ACTUAL PASSWORD

We're going to use a [hashing library called `bcrypt`](https://www.npmjs.com/package/bcrypt). Install it

```
npm i -s bcrypt
```

Import it at the top of `index.js` and set a salt rounds value

```javascript
import bcrypt from "bcrypt";

const saltRounds = 10;
```

Salting is a technique that makes storing hashes more secure. How it works is out of scope for this tutorial, but 10 is the value listed in the bcrypt module's documentation so it's good enough for us.

Now, hash and store their password in the register route

```javascript
app.post("/register", async (req, res) => {
  const db = await dbPromise;
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(hashedPassword);
  await db.run(
    "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
    email,
    name,
    hashedPassword
  );
  res.redirect("/");
});
```

I threw a console.log in there so we could see what a hashed password looks like. If you run
the code and register yourself, you'll see it's total nonsense.

## Verifying the user's password

First we need to collect it in the message form in `views/home.handlebars`

```HTML
<form method="POST" action="message">
  <input type="email" name="authorEmail" placeholder="Enter your email">
  <input type="password" name="authorPassword" placeholder="Enter your password">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>
```

Now, check it in the message post route in `index.js`

```javascript
app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message, authorEmail, authorPassword } = req.body;
  const author = await db.get("SELECT * FROM users WHERE email=?", authorEmail);
  if (!author) {
    console.log("notfound");
    const messages = await db.all("SELECT * FROM messages");
    return res.render("home", { messages, error: "user does not exist" });
  }
  const passwordMatches = await bcrypt.compare(authorPassword, author.password);
  if (!passwordMatches) {
    const messages = await db.all("SELECT * FROM messages");
    return res.render("home", { messages, error: "password is wrong" });
  }
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    author.id
  );
  res.redirect("/");
});
```

At this point I kind of regret going this direction for error handling. You'll notice that if you
do get an error the message authors disappear because we didn't copy over the left join query
from the index route. We could do that, we could copy it into a common function and make this work,
but we're about to make a login page so this error handling will go away anyway.
