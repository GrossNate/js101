const readline = require('readline-sync');
const usdFormatter = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
const percentFormatter = Intl.NumberFormat('en-US', {style: 'percent', minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger'});

// Writing a function to reliably truncate a number to decimal digits.
// Unfortunately, the vagaries of floating point arithmetic make this tricky.
// Expects the number to be truncated and the number of digits to truncate to.
function truncDecimal(number, digits) {
  let truncatedValue = Number(number.toFixed(digits));
  if ((number > 0) && (truncatedValue > number)) {
    truncatedValue -= Math.pow(10, -digits);
  } else if ((number < 0) && (truncatedValue < number)) {
    truncatedValue += Math.pow(10, -digits);
  }
  return truncatedValue;
}
/**
 * 
 * @param {*} principle 
 * @param {*} apr 
 * @param {*} period 
 * @returns {Object}  
 */
// Returns an object with the the number of identical payments, amount of
// identical payment, and amount of final payment.
function generatePaymentPlan(principle, apr, period) {
  // This is the correct way. APR/12 is just an approximation.
  const rate = ((1 + apr) ** (1 / 12)) - 1;
  const payment = truncDecimal(
    (principle * (rate / (1 - Math.pow((1 + rate), (-period))))),
    2
  );
  const returnObject = {
    numberIdenticalPayments: period - 1,
    identicalPaymentAmount: payment,
    finalPaymentAmount: null
  };
  let loanAmount = principle;
  for (let i = 1; i <= period; i++) {
    const monthlyInterest = Number((loanAmount * rate).toFixed(2));
    loanAmount += monthlyInterest;
    loanAmount -= payment;
    if (i === period) returnObject.finalPaymentAmount = payment + loanAmount;
  }
  return returnObject;
}

// Returns the period in months or NaN if the input can't be parsed.
function parsePeriod(periodText) {
  const yearsPortion = periodText.match(RegExp(/(?<years>\d+)\s*y/));
  const monthsPortion = periodText.match(RegExp(/(?<months>\d+)\s*m/));
  if (yearsPortion !== null || monthsPortion !== null) {
    return (
      ((yearsPortion === null ? 0 : Number(yearsPortion.groups.years)) * 12)
      + (monthsPortion === null ? 0 : Number(monthsPortion.groups.months))
    );
  }
  const returnMonths = Number.parseInt(periodText, 10);
  if (returnMonths > 0) return returnMonths;
  return NaN;
}

// Returns the loan principle amount or NaN if the input can't be parsed.
function parsePrinciple(principleText) {
  return Number.parseFloat(principleText.replaceAll(/[^\d^\.]/g, ''));
}

// Returns the rate or NaN if the input can't be parsed.
function parseRate(rateText) {
  let returnRate = Number.parseFloat(rateText.replaceAll(/[^\d^\.]/g, ''));
  return (/\d%/.test(rateText)) ? returnRate / 100 : returnRate;
}

function prompt(message) {
  console.log(`=> ${message}`);
}

// Actual program body.
prompt('Please enter the loan principle amount:');
let principle = parsePrinciple(readline.question());
while (Number.isNaN(principle)) {
  prompt("I can't parse that amount. Examples of valid input are '$900,000.23' or '900000.23'. Try again:");
  principle = parsePrinciple(readline.question());
}

prompt('Please enter annual percentage rate:');
let apr = parseRate(readline.question());
while (Number.isNaN(apr)) {
  prompt("I can't parse that rate. Examples of valid input are '.055' or '5.5%'. Try again:");
  apr = parseRate(readline.question());
}

prompt('Please enter the repayment period (you can denote years with "y" and months with "m"; plain numeric values are interpreted as months):');
let period = parsePeriod(readline.question());
while (Number.isNaN(period)) {
  prompt("I can't parse that as a loan period. Examples of valid input are '4y 6m' or '54'. Try again:");
  period = parsePeriod(readline.question());
}

let paymentPlan = generatePaymentPlan(principle, apr, period);
console.log(`Repaying this loan of ${usdFormatter.format(principle)} at ${percentFormatter.format(apr)} will require ${paymentPlan.numberIdenticalPayments} monthly payments of ${usdFormatter.format(paymentPlan.identicalPaymentAmount)} and a final payment of ${usdFormatter.format(paymentPlan.finalPaymentAmount)}`);