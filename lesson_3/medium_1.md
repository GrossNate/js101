# Question 1
let statement = 'The Flintstones Rock!';
for (let i = 0; i < 10; i += 1) {
  console.log(statement);
  statement = " " + statement;
}

> They wanted to use " ".repeat(padding)

# Question 2
munstersDescription.split('').reduce((reversed, char) => reversed + (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()), '')

> They wanted to use .map() and then .join()

# Question 3
function factors(number) {
  let factors = [];
  for (let potentialFactor = 1; potentialFactor <= number; potentialFactor++) {
    if (number % potentialFactor === 0) factors.push(potentialFactor);
  }
  return factors;
}

Bonus: % determines the remainder.

> They still wanted us to use a while loop and count down. With this approach you need to push (number/divisor), otherwise the array you return will be sorted descending.

# Question 4
I don't think there's effectively a difference, however it should be noted that the push method mutates the existing buffer Array whereas the concat method has to reassing the buffer Array. Since Javascript uses pass by reference for Arrays, this works out okay.

> WRONG! Actually, the second method doesn't mutate buffer because reassignment doesn't affect passed-by-reference parameters!!!

# Question 5
0.9
true

> WRONG! Because of floating point arithmetic, you actually get:
> 0.8999999999999
> false

# Question 6
false

Bonus: isNaN() or Math.isNaN()

# Question 7
34

# Question 8
No, because Object.values returns an Array of the values.

> WRONG! Object.values returns an Array of the values, but we can still refer to them  and change them. We're still referencing the same places in memory.

# Question 9
paper

# Question 10
no
