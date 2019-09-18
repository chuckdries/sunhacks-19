console.log("hello world");
const planets = ["sun", "earth", "venus", "mercury"];

for (planet of planets) {
  console.log(`I want to go to ${planet}`);
}

console.log(add(1, 2));

function add(x, y) {
  return x + y;
}

const subtract = function(x, y) {
  return x - y;
};

console.log(subtract(4, 2));

const multiply = (x, y) => {
  return x * y;
};

console.log(multiply(2, 7));

const divide = (x, y) => x / y;

console.log(divide(8, 2));
