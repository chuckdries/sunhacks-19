# 9. Login and sessions

Typing your password every single time you do something is annoying. Let's write a login
page where you type your password once, and we remember who you are. This remembering
is called a "session". Sessions are unique per user per browser, and we keep track of them
by setting a cookie after the user logs in.

Activities

1. Add a login route that validates passwords
2. Generate and store "sessions"
3. Write a middleware that looks up a user by their session cookie and apply it

## Writing a login route

At this point, we've got this one in the bag. Write a template, `views/login.handlebars`

```HTML
<h1>log in</h1>
{{#if error}}
<p style="color: red">{{error}}</p>
{{/if}}
<form action="login" method="post">
  <input type="email" name="email" placeholder="email">
  <input type="password" name="password" placeholder="password">
  <button type="submit">log in</button>
</form>
<a href="/register">register</a>
<a href="/">home</a>
```

We'll need a GET route to display the login page and a POST route to check the user's credentials.
Add both to `index.js`

```javascript
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", email);
  if (!user) {
    return res.render("login", { error: "user does not exist" });
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.render("login", { error: "password is wrong" });
  }
  res.redirect("/");
});
```

If you get your password or email wrong, you get an error. If you get it right, you get redirected to the
homepage, where nothing happens. We'll get to that when we implement sessions, but we have some cleaning
up to do first.

The password validation logic looks mostly the same as it did in the message route, where it's no
longer needed. Remove it from `index.js`

```javascript
app.post("/message", async (req, res) => {
  const db = await dbPromise;
  const { message } = req.body;
  await db.run(
    "INSERT INTO messages (message, authorId) VALUES (?, ?)",
    message,
    author.id
  );
  res.redirect("/");
});
```

Also remove the corresponding fields from `views/home.handlebars`. While we're here, we're going
to do some preparation to handle logged in vs. not logged in users. Here's the modified home template
in its entirety

```HTML
<h1>messages</h1>

<ul>
  {{#each messages}}
  <li>{{this.message}} ({{this.author}})</li>
  {{/each}}
</ul>

{{#if error}}
<p style="color: red">{{error}}</p>
{{/if}}

{{#if user}}
<form method="POST" action="message">
  <input type="text" name="message" placeholder="Enter a message">
  <button type="submit">send</button>
</form>
{{else}}
<p>You can't send a message until you log in</p>
<a href="/register">register</a>
<a href="/login">log in</a>
{{/if}}
```

Let's add a convenience links to the bottom of the registration page at `views/register.handlebars` as well

```HTML
<a href="/login">log in</a>
<a href="/">home</a>
```

## Sessions and cookies

Run your code. Notice that right now, when you log in, nothing happens.
We need to start a session when you log in.

A session is a thing we store in the database that associates you with your browser.
As previously mentioned, we keep track of your browser with a cookie that just has a unique
string in it. Let's call that the session token.

Before we implement anything, we need to add sessions to our database. Open up `migrations/001-initial-schema.sql`

```SQL
-- Up
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name STRING,
  email STRING UNIQUE,
  password STRING
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  authorId INTEGER,
  message STRING,
  FOREIGN KEY(authorId) REFERENCES users(id)
);

CREATE TABLE sessions (
  token STRING PRIMARY KEY,
  userId INTEGER,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Down
DROP TABLE users;
DROP TABLE messages;
DROP TABLE sessions;
```

Next, we need a way to generate unique strings. We'll use a
[package called `uuid`](https://www.npmjs.com/package/uuid) for that.

```
npm i -s uuid

```

Again, import it near the top of `index.js`

```javascript
import uuid from "uuid/v4";
```

We use `uuid/v4` because there are different versions of uuids that do different things.
See their documentation for more detail.

All of our session creation happens in the login route

```javascript
app.post("/login", async (req, res) => {
  const db = await dbPromise;
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", email);
  if (!user) {
    return res.render("login", { error: "user does not exist" });
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.render("login", { error: "password is wrong" });
  }
  const accessToken = uuid();
  await db.run(
    "INSERT INTO sessions (userId, token) VALUES (?, ?)",
    user.id,
    accessToken
  );
  res.cookie("accessToken", accessToken);
  res.redirect("/");
});
```

also as a convenience, let's automatically log people in when they register.

Now that we've cookied our access token on login, the user's browser will send it back to us
on every request. That way instead of checking the user's password in the message route like we were
before, we can simply check that their accessToken is valid. That's our next step.
