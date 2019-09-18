# 1. A quick intro to javascript and node

reference branch: `prep/basics`

We've created a file, `index.js`, and a start command, `npm run start`. Try typing `npm run start` into your terminal. Then, edit `index.js` and do it again. This slide is just a place to familiarize ourselves with javascript.

Activities

1. make a file called `index.js`
2. add a start script to the `scripts` section of the package.json
3. Write and run a "hello world"
4. Play around with for loops and functions

## Adding a start script

You could just run your code with `node index.js`, but defining a start script makes things easier in the long term, plus it tells people how to run your code. Update your package.json file to look something like this

```json
{
  "name": "sunhacks-19",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC"
}
```

## Hello world

Go ahead and update index.js to print "Hello, world"

```javascript
// index.js
console.log("Hello, world");
```

Save it, and run it by typing `npm run start` into your terminal.

Below is a reference to all the important javascript syntax and features. There's a lot there, so don't worry about memorizing it. Just make note of what arrow functions and for loops look like, and you can come back to this later

NOTE: semicolons at the end of lines are optional, and you can use single or double quotes for strings

## Language reference

### Variables

```javascript
var x = 2;
let y = 3;
const z = 4;
```

let and const have different scoping rules than var  
(don't worry about it for now)

const can't be reassigned

```javascript
x = 7; // fine
y = 8; // fine
z = 9; // will throw an error
```

### Objects

Javascript has classes and constructors and such, but for now think of objects as bundles of variables

```javascript
const person1 = {
  name: "chuck",
  age: 22,
  occupation: "programmer"
};

// 2 ways to access properties
person1.name; // 'chuck'
person1["age"]; // 22
```

Object destructure

```javascript
const person2 = {
  name: "Nelson",
  age: "21"
};

// if you need a property from this object, you can either
// a) access it normally
const age = person2.age;
// or b) destructure it
const { name } = person2;

age; // 21
name; // "Nelson"
```

### Functions

2 types of functions

1. named function
2. anonymous function  
   a. function keyword  
   b. arrow function

#### Named functions

Note that named functions are "hoisted", so they can be called even before they're declared

```javascript
add(1, 2); // 3

function add(x, y) {
  return x + y;
}
```

#### Anonymous functions

Anonymous functions are sometimes called function expressions. They're literal values, just like a string or a number, and can be assigned to a variable. They obey the same scoping rules as variables, so they must be declared and in scope to be used

Function Keyword

```javascript
const add = function(x, y) {
  return x + y;
};

add(1, 2); // 3

for (let i = 0; i < 10; i++) {
  // const works here because the variables go away before the next iteration runs
  const subtract = function(x, y) {
    return x - y;
  };
  subtract(10, i); // counts down from 10
}

subtract(3, 2); // error: not defined

// NOTE: this example re-defines `subtract` every loop
// doing so is unnecessary and only done for demonstration purposes
```

Arrow syntax

```javascript
// standard
const add = (x, y) => {
  return x + y;
};

// shorthand
// if the right side of the arrow is an expression instead of a block, your function will automatically return that value
const subtract = (x, y) => x - y;
```

### For Loops

Basicaly the same as C, but there's also a for...of for convenience. (There's also for...in, but don't use it - it doesn't work the way you'd expect it to)

```javascript
const names = ["Chuck", "Nelson"];
for (name of names) {
  console.log("hello " + name); // logs "hello Chuck\nhello Nelon"
}
```

### Strings

- There's no distinction between strings and characters
- Unlike Java, you can actually use `==` to compare strings. It works
- I just want to point out that javascript has a special type of string called a "template string" that is sometimes more convenient than adding 2 strings together

```javascript
const name = "Carter";
const greeting1 = "hello " + name;
const greeting2 = `hello ${name}`; // notice the back tick

greeting1 == greeting2; // true
```
