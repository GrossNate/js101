# Question 1
No error.
Bonus: undefined

> Correct!

# Question 2
(str1[str1.length-1] === "!")

> Works, but easier: str1.endsWith("1");
> Also, note that for empty strings you're comparing undefined with "!"

# Question 3
Object.hasOwn(ages, 'Spot');

> Given answer is ages.hasOwnProperty('Spot') but according to mdn, hasOwn() is preferred.

# Question 4
munstersSentenceCase = munstersDescription.slice(0,1).toUpperCase() + munstersDescription.slice(1).toLowerCase();

> Given answer users .charAt(0) and .substring(1) instead of .slice()

# Question 5
true
false

# Question 6
Object.assign(ages, additionalAges);

# Question 7
str1.includes("Dino")
str2.includes("Dino")

# Question 8
flintstones.push("Dino");

# Question 9
Assuming the multiple items are in another array, then concat()
flinstones = flinstones.concat(['Dino', 'Hoppy']);

> WRONG (kind of) - answer wants us to pass multiple strings to push()

# Question 10
advice.substring(0, advice.indexOf('house'))

> Given answer uses slice()
