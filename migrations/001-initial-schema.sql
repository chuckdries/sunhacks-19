-- Up
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name STRING NOT NULL,
  email STRING NOT NULL
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  authorId INTEGER NOT NULL,
  message STRING NOT NULL,
  FOREIGN KEY(authorId) REFERENCES users(id)
);

-- Down
DROP TABLE messages;
DROP TABLE users;
