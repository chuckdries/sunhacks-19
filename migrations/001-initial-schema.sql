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
