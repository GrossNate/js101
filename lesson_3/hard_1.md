# Question 1
Maybe not? Because Javascript will automatically decide that the return in second() is returning nothing (it infers an end of statement). Just a guess.

# Question 2
{ first: [ 1, 2 ] }

# Question 3
A.
one is: one
two is: two
three is: three

B.
one is: one
two is: two
three is: three

C.
one is: two
two is: three
three is: one

# Question 4
function isAnIpNumber(str) {
  if (/^\d+$/.test(str)) {
    let number = Number(str);
    return number >= 0 && number <= 255;
  }

  return false;
}
function isDotSeparatedIpAddress(inputString) {
  let dotSeparatedWords = inputString.split(".");
  
  if (dotSeparatedWords.length !== 4) return false;

  let returnValue = true;

  while (dotSeparatedWords.length > 0) {
    let word = dotSeparatedWords.pop();
    if (!isAnIpNumber(word)) {
      returnValue = false;
      break;
    }
  }

  return returnValue;
}

> They have a more elegant solution to just return false in the while loop instead of break.
