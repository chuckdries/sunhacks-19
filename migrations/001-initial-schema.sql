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