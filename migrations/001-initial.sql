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


-- Down
DROP TABLE users;
DROP TABLE messages;