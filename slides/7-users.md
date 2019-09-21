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
