// Ask the user for the first number.
// Ask the user for the second number.
// Ask the user for an operation to perform.
// Perform the operation on the two numbers.
// Print the result to the terminal.
const messages = require('./calculator-messages.json');
const readline = require('readline-sync');

const language = 'ru';

function prompt(message) {
  console.log(`=> ${message}`);
}

function invalidNumber(number) {
  return number.trimStart() === '' || Number.isNaN(Number(number));
}

function calculate() {
  prompt(messages['ask first number'][language]);
  let number1 = readline.question();

  while (invalidNumber(number1)) {
    prompt(messages['invalid number'][language]);
    number1 = readline.question();
  }

  prompt(messages['ask second number'][language]);
  let number2 = readline.question();

  while (invalidNumber(number2)) {
    prompt(messages['invalid number'][language]);
    number2 = readline.question();
  }

  prompt(messages['choose operation'][language]);
  let operation = readline.question();

  while (!['1', '2', '3', '4'].includes(operation)) {
    prompt(messages['invalid operation'][language]);
    operation = readline.question();
  }
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

  prompt(`${messages['result is'][language]} ${output}`);
}

let running = true;
prompt(messages['welcome'][language]);

while (running) {
  calculate();
  prompt(messages['run again'][language]);
  let runAgain = readline.question();
  while (![messages['run again y'][language], messages['run again n'][language], messages['run again y'][language].toUpperCase(), messages['run again n'][language].toUpperCase()].includes(runAgain)) {
    prompt(messages['invalid run again'][language]);
    runAgain = readline.question();
  }
 
  running = (runAgain.toLowerCase() === messages['run again y'][language]);
}