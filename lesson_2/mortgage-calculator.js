// Ask user for principle
// Ask user for APR
// Ask user for repayment period
// Convert APR to monthly rate
// Calculate monthly payment amount
// Format monthly payment amount nicely

const readline = require('readline-sync');

function prompt(message) {
  console.log(`=> ${message}`);
}

prompt('Please enter the loan principle amount:');
let principle = readline.question();

prompt('Please enter annual percentage rate in decimal format:');
let apr = readline.question();

prompt('Please enter the repayment period in months:');
let period = readline.question();

// let rate = Math.pow((1 + apr), (1/12)) - 1;
let rate = apr / 12;

let payment = principle * (rate / (1 - Math.pow((1 + rate), (-period))));

console.log(payment);