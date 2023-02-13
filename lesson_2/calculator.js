// Ask the user for the first number.
// Ask the user for the second number.
// Ask the user for an operation to perform.
// Perform the operation on the two numbers.
// Print the result to the terminal.
const MESSAGES = require('./calculator-messages.json');
const readline = require('readline-sync');

const LANGUAGE = 'en';

function message(whichMessage) {
  return MESSAGES[whichMessage][LANGUAGE];
}

function prompt(message) {
  console.log(`=> ${message}`);
}

function invalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

function performCalculation(number1, number2, operation) {
  let output;
  switch (operation) {
    case '1':  // '1' represents addition
      output = Number(number1) + Number(number2);
      break;
    case '2':  // '2' represents subtraction
      output = Number(number1) - Number(number2);
      break;
    case '3':  // '3' represents multiplication
      output = Number(number1) * Number(number2);
      break;
    case '4':  // '4' represents division
      output = Number(number1) / Number(number2);
      break;
  }
  return output;
}

let running = true;
prompt(message('welcome'));

while (running) {
  prompt(message('ask first number'));
  let number1 = readline.question();

  while (invalidNumber(number1)) {
    prompt(message('invalid number'));
    number1 = readline.question();
  }

  prompt(message('ask second number'));
  let number2 = readline.question();

  while (invalidNumber(number2)) {
    prompt(message('invalid number'));
    number2 = readline.question();
  }

  prompt(message('choose operation'));
  let operation = readline.question();

  while (!['1', '2', '3', '4'].includes(operation)) {
    prompt(message('invalid operation'));
    operation = readline.question();
  }
  prompt(`${message('result is')} ${performCalculation(number1, number2, operation)}`);
  prompt(message('run again'));
  let runAgain = readline.question();
  while (![message('run again y'), message('run again n'), message('run again y').toUpperCase(), message('run again n').toUpperCase()].includes(runAgain)) {
    prompt(message('invalid run again'));
    runAgain = readline.question();
  }
  running = (runAgain.toLowerCase() === message('run again y'));
}