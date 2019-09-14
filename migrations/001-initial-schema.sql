-- Up
CREATE TABLE messages (
  id INTEGER PRIMARY KEY,
  author STRING NOT NULL,
  message STRING NOT NULL
);

-- Down
DROP TABLE messages;
