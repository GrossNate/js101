# Question 1
advice.replaceAll("important", "urgent")

# Question 2
Array.from(numbers).reverse();

Array.from(numbers).sort((num1, num2) => num2 - num1);

let newArray = [];
numbers.forEach(num => newArray.splice(0, 0, num));

> Answer used slice() instead of from(), then Spread syntax instead of from(), then unshift() instead of splice()

# Question 3
numbers.includes(number1)
numbers.includes(number2)

# Question 4
famousWords = "Four score and ".concat(famousWords);
famousWords = famousWords.padStart("Four score and ".length + famousWords.length, "Four score and ");

> They wanted just to use +

# Question 5
[1, 2, 3, 4, 5].splice(2,1)

# Question 6
let flintstones = ["Fred", "Wilma"];
let newFlinstones = flinstones.concat(["Barney", "Betty"], ["Bambam", "Pebbles"])

> They wanted us to start with the nested array and flatten it. :-( Unclear instructions so I just used concat() on the original array.

Need to work on spread syntax as well as accumulator functions.

# Question 7
 Object.entries(flintstones).filter(element => element[0] === 'Barney')[0]

 > They want to use shift() instead of [0]

 # Question 8
Array.isArray()

# Question 9
title
  .padStart(Math.floor((40 - title.length) / 2) + title.length, " ")
  .padEnd(40, " ")

> I overdid it. Should have just padded the start!

# Question 10
Array.from(statement1.matchAll("t")).length

> They wanted us to split it on '', then filter the array for "t" then use length.


