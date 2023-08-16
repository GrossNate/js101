# Question 1
let numbers = [1, 2, 3, 4];
while (numbers.length > 0) {
  numbers.pop();
}
numbers = [1, 2, 3, 4];
while (numbers.length > 0) {
  numbers.shift();
}
numbers = [1, 2, 3, 4];
numbers = [];

> They wanted numbers.length = 0 and numbers.splice(0, numbers.length)

# Question 2
Hmmm. [1, 2, 3, [4, 5]] maybe

> Nope. + converts to string and then concatenates, so: 1,2,34,5

# Question 3
hello there

# Question 4
[{ first: "42" }, { second: "value2" }, 3, 4, 5]

# Question 5
function isColorValid(color) {
  return (color === "blue" || color === "green");
}

const isColorValid = (color) => (color === "blue" || color === "green");

> Also can use ["blue", "green"].includes
