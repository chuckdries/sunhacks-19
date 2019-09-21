# 5. Modern JavaScript

Before we move on to databases, we have some housekeeping to do that will make our lives easier

Activities:

0. Prepare our project to use ES Modules
1. Convert our `require()`s to `import`s
1. Learn about `Promise`s

## Preparing our project

Before we get started with our databse, there are a few features that are relatively new to javascript
that will make our life a lot easier.

### ESM import/export

Some history: Javascript didn't used to have a way to reference other files. Everything in browsers was global,
so libraries like jquery just attached themselves to global objects (in that case, an object called `$`). When
Node came around, they had to invent a way to reference other files, and they didn't want everything in your project
to be global either. The solution they came up with was the `require` call.

The system they invented is now known as CommonJS. It's fine, it's what we've been using so far, but a lot has changed since then, and Javascript now has a standardized module system call ESM, or ECMAScript Modules. Node doesn't support it natively yet because they're still figuring out the best way to be backwards compatible with CommonJS (and other module systems that various other projects invented over the years).

ESModules are a lot easier to work with in my opinion, so we're going to add a [package called `esm`](https://www.npmjs.com/package/esm) that will let us use them today.

```
npm i -s esm
```

And we need to modify our start script in `package.json` to use `esm`

```JSON
{
  "start": "nodemon -r esm index.js"
}
```

ES Modules declare what they want to share with the world with `export` statements. You can export individual
functions or values like so

```javascript
// sampleFile.js
export const sayHello = () => {
  console.log("hello");
};
```

This is called a "named export", and you import it like this

```javascript
import { sayHello } from "./sampleFile";

// use as you might expect
sayHello();
```

You can also import every named export from a file all at once like this

```javascript
import * as sampleStuff from "./sampleFile";

// use like so:
sampleStuff.sayHello();
```

Every ES Module file can also have one "default" export:

```javascript
export default () => {
  console.log("goodbye");
};
```

Notice that default exports don't have names. When you import them, you can name them whatever you want

```javascript
import sayGoodbye from "./sampleFile";

// use like a named export
sayGoodbye();
```

`esm` exposes our CommonJS modules' content as default exports, so we merely need to change our require calls
to import statements and everything else will continue to work as normal

```javascript
// before
const express = require("express");

// after
import express from "express";
```

### Promises

Promises are a feature of Javascript that let us represent data that may not exist yet.

The basic gist is that a `Promise` is pending while it waits for whatever it's waiting for, then it "resolves" with a value
or "rejects" with an error.

Promises have a method on them called `.then`. You can pass it a function, and it will call your callback function
when that promise resolves.

For the examples in this section, I've written a function called `getPromiseTimer` that takes in an amount of time
(in milliseconds) and a value, and returns a promise that will resolve to that value after the given amount of time

```javascript
const helloTimer = getPromiseTimer(300, "hello there");

helloTimer.then(value => {
  console.log(value);
});
console.log("here");
// this code will log "here", then, 300ms later it will log "hello ther"
```

You can also interact with promises by `await`ing them. `await` only works inside an `async` function, and it basically
pauses the function until the promise resolves.

```javascript
const playingWithPromises = async () => {
  const helloTimer = getPromiseTimer(300, "hello there");
  console.log("two");
  const message = await helloTimer;
  console.log(message);
  console.log("three");
};

console.log("one");
playingWithPromises();
console.log("four");

// this code will log, "one", "two", wait 300ms, then log "hello there", "three", "four"
```

I've created a file in the example branch for this slide `utilities/getPromiseTimer.js`. Feel free to import
it into `index.js` (where you'll note I've converted all the require statements to imports) and play with it like
I've shown above

We're going to be using a database called SQLite. Most databases are separate servers that you connect to, but sqlite is just a library that runs with your code and stores things in a file.
