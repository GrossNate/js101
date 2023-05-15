const readline = require('readline-sync');
const formatUsd = Intl.NumberFormat(
  'en-US',
  {style: 'currency', currency: 'USD'}
).format;
const formatPercent = Intl.NumberFormat(
  'en-US',
  {
    style: 'percent',
    minimumFractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger'
  }
).format;

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

function prompt(message) {
  console.log(`=> ${message}`);
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
 * Creates a payment plan description that should be human-readable.
 * @param {PaymentPlan} paymentPlan - details of the payment plan.
 * @param {number} principle
 * @param {number} apr
 * @param {number} period
 * @returns {String}
 */
function generateRepaymentDescription(paymentPlan, principle, apr, period) {
  let repaymentDescription = '';
  if (paymentPlan.numberIdenticalPayments === 0 && period === 1) {
    repaymentDescription = `Repaying this loan of ${formatUsd(principle)} at `
      + `${formatPercent(apr)} will require a single monthly payment of `
      + `${formatUsd(paymentPlan.finalPaymentAmount)}`;
  } else {
    repaymentDescription = `Repaying this loan of ${formatUsd(principle)} at `
      + `${formatPercent(apr)} will require `
      + `${paymentPlan.numberIdenticalPayments} monthly payments of `
      + `${formatUsd(paymentPlan.identicalPaymentAmount)} and a final `
      + `payment of ${formatUsd(paymentPlan.finalPaymentAmount)}`;
  }
  return repaymentDescription;
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
  const returnPrinciple = Number.parseFloat(
    principleText.replaceAll(/[^\d^.^-]/g, '')
  );
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

/**
 * Gets the principle amount as input from user.
 * @returns {number} The amount of the loan.
 */
function getPrinciple() {
  prompt('Please enter the loan principle amount:');
  let principle = parseAndValidatePrinciple(readline.question());
  while (Number.isNaN(principle)) {
    prompt("I can't parse that amount. Examples of valid input are "
    + "'$900,000.23' or '900000.23'. Try again:");
    principle = parseAndValidatePrinciple(readline.question());
  }
  console.log("\n");
  return principle;
}

/**
 * Gets the APR from the user. Note it's an APR, not APY.
 * @returns {number} The annual percentage rate.
 */
function getApr() {
  prompt('Please enter annual percentage rate:');
  let apr = parseAndValidateRate(readline.question());
  while (Number.isNaN(apr)) {
    prompt("I can't parse that rate. Examples of valid input are '.055' or "
      + "'5.5%'. Try again:");
    apr = parseAndValidateRate(readline.question());
  }
  console.log("\n");
  return apr;
}

/**
 * Gets the repayment period from the user.
 * @returns {number} The number of months in the repayment period.
 */
function getPeriod() {
  prompt('Please enter the repayment period (you can denote years with "y" and '
  + 'months with "m", e.g. "5y 6m" is interpreted as 66 months; plain numeric '
  + 'values are interpreted as months):');
  let period = parseAndValidatePeriod(readline.question());
  while (Number.isNaN(period)) {
    prompt("I can't parse that as a loan period. Examples of valid input are "
    + "'4y 6m' or '54'. Also, the period must be greater than 0. Try again:");
    period = parseAndValidatePeriod(readline.question());
  }
  console.log("\n");
  return period;
}

function runCalculator() {
  let principle = getPrinciple();
  let apr = getApr();
  let period = getPeriod();

  let paymentPlan = generatePaymentPlan(principle, apr, period);

  let repaymentDescription = generateRepaymentDescription(
    paymentPlan,
    principle,
    apr,
    period);

  console.log(repaymentDescription + "\n");
}

// Actual body of program.
while (true) {
  console.clear();
  console.log("Welcome to the Fairly Forgiving Mortgage Calculator!\n\n"
    + "It's called 'Fairly Forgiving' because you can enter values in ways "
    + "that should make intuitive sense. For example, .055 and 5.5% are "
    + "interpreted the same. (But 5.5 would be interpreted as 550%, so do be "
    + "careful!)\n\n"
    + "Note also that this can only be used to compute loans that have a "
    + "positive interest rate and have at least a one month repayment period. "
    + "\n");
  runCalculator();
  prompt('Would you like to run another calculation? (Y/N):');
  if (readline.question().toLowerCase() !== 'y') break;
}