const readline = require('readline-sync');
const usdFormatter = Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
const percentFormatter = Intl.NumberFormat('en-US', {style: 'percent', minimumFractionDigits: 2, trailingZeroDisplay: 'stripIfInteger'});

/**
 * @typedef {Object} PaymentPlan
 * @property {number} numberIdenticalPayments - The number of identical
 * payments (this should be the number of months - 1).
 * @property {number} identicalPaymentAmount - The amount of all the payments
 * except the final payment.
 * @property {number} finalPaymentAmount - The amount of the final payment.
 */

/**
 * Reliably truncate a number to decimal digits.
 * @param {number} number - number to be truncated
 * @param {number} digits - number of decimal digits to truncate to
 * @returns {number} truncated number
 */
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
 * Based on the parameters, generates a payment plan. We do this because the
 * simple formula used in this exercise doesn't actually result in the full
 * value of the loan being repaid. Typically the last payment is different by a
 * small amount to account for the fact that we can't make payments smaller than
 * $0.01.
 * @param {number} principle - Assumes a number greater than 0.
 * @param {number} apr - Assumes a number greater than 0.
 * @param {number} period - Assumes a number greater than 0.
 * @returns {PaymentPlan} A payment plan with the number of identical payment,
 * the payment amount, and the final payment amount.
 */
function generatePaymentPlan(principle, apr, period) {
  const rate = apr / 12;
  const payment = truncDecimal(
    (principle * (rate / (1 - Math.pow((1 + rate), (-period))))),
    2);
  const returnObject = {
    numberIdenticalPayments: period - 1,
    identicalPaymentAmount: payment,
    finalPaymentAmount: null
  };
  let loanAmount = principle;
  for (let monthCount = 1; monthCount <= period; monthCount++) {
    const monthlyInterest = Number((loanAmount * rate).toFixed(2));
    loanAmount += monthlyInterest;
    loanAmount -= payment;
    if (monthCount === period) returnObject.finalPaymentAmount = payment +
      loanAmount;
  }
  return returnObject;
}

/**
 * Parses the text entered into a number of months and ensures it's > 0.
 * @param {String} periodText
 * @returns {number} number of months in period or NaN if unparseable.
 */
function parseAndValidatePeriod(periodText) {
  const yearsPortion = periodText.match(RegExp(/(?<years>\d+)\s*y/));
  const monthsPortion = periodText.match(RegExp(/(?<months>\d+)\s*m/));
  if (yearsPortion !== null || monthsPortion !== null) {
    const returnMonths =
      ((yearsPortion === null ? 0 : Number(yearsPortion.groups.years)) * 12)
      + (monthsPortion === null ? 0 : Number(monthsPortion.groups.months));
    return (returnMonths > 0 ? returnMonths : NaN);
  }
  const returnMonths = Number.parseInt(periodText, 10);
  if (returnMonths > 0) return returnMonths;
  return NaN;
}

/**
 * Parses the text entered into a number and ensures it's > 0.
 * @param {String} principleText
 * @returns {number} The principle as a number or NaN if it can't parse.
 */
function parseAndValidatePrinciple(principleText) {
  const returnPrinciple = Number.parseFloat(principleText.replaceAll(/[^\d^.^-]/g, ''));
  return (returnPrinciple > 0 ? returnPrinciple : NaN);
}

/**
 * Parses the text entered into a decimal number, allowing either decimal input
 * or a X% style input. E.g. ".05" and "5%" will both return .05. Also ensures
 * the number is > 0.
 * @param {String} rateText
 * @returns {number} The rate as a decimal number or NaN if it can't parse.
 */
function parseAndValidateRate(rateText) {
  let returnRate = Number.parseFloat(rateText.replaceAll(/[^\d^.^-]/g, ''));
  returnRate = (/\d%/.test(rateText)) ? returnRate / 100 : returnRate;
  return (returnRate > 0 ? returnRate : NaN);
}

function prompt(message) {
  console.log(`=> ${message}`);
}

// Actual program body.
prompt('Please enter the loan principle amount:');
let principle = parseAndValidatePrinciple(readline.question());
while (Number.isNaN(principle)) {
  prompt("I can't parse that amount. Examples of valid input are '$900,000.23' or '900000.23'. Try again:");
  principle = parseAndValidatePrinciple(readline.question());
}

prompt('Please enter annual percentage rate:');
let apr = parseAndValidateRate(readline.question());
while (Number.isNaN(apr)) {
  prompt("I can't parse that rate. Examples of valid input are '.055' or '5.5%'. Try again:");
  apr = parseAndValidateRate(readline.question());
}

prompt('Please enter the repayment period (you can denote years with "y" and months with "m"; plain numeric values are interpreted as months):');
let period = parseAndValidatePeriod(readline.question());
while (Number.isNaN(period)) {
  prompt("I can't parse that as a loan period. Examples of valid input are '4y 6m' or '54'. Also, the period must be greater than 0. Try again:");
  period = parseAndValidatePeriod(readline.question());
}

let paymentPlan = generatePaymentPlan(principle, apr, period);
console.log(`Repaying this loan of ${usdFormatter.format(principle)} at ${percentFormatter.format(apr)} will require ${paymentPlan.numberIdenticalPayments} monthly payments of ${usdFormatter.format(paymentPlan.identicalPaymentAmount)} and a final payment of ${usdFormatter.format(paymentPlan.finalPaymentAmount)}`);