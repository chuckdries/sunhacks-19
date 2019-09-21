-- Up
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email STRING UNIQUE,
  password STRING,
  name STRING
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  message STRING,
  authorId INTEGER,
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