// Example 1
console.log('Accidentally using a global variable as the iterator in a for loop');

let foo = 0;
console.log(foo);

for (foo = 1; foo <= 3; foo += 1) {
  console.log(foo);
}

console.log(foo);

// Example 2
console.log('Standard for loop, showing variable shadowing');

let bar = 0;
console.log(bar);

for (let bar = 1; bar <= 3; bar += 1) {
  console.log(bar);
}

console.log(bar);

// Example 3
console.log('Using global variable as iterator, then variable shadowing within for loop');

let baz = 0;
console.log(baz);

for (baz = 1; baz <= 3; baz += 1) {
  let baz = 1;
  console.log(baz);
}

console.log(baz);

// Example 4
console.log('OMG apparently there can be separate scopes for the iterator and the body of the for loop?!?');

let qux = 0;
console.log(qux);

for (let qux = 1; qux <= 3; qux += 1) {
  let qux = 1;
  console.log(qux);
}

console.log(qux);

let qux = 0;
