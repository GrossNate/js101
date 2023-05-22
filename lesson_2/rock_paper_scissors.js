const readline = require('readline-sync');

const NUM_ROUNDS = 3;

// To add or remove choices to the game, just add/remove and edit the CHOICES
// map. The key is the choice and the value is an array of the other choices
// that the key beats.
const CHOICES = new Map();
CHOICES.set("rock", ["scissors", "lizard"]);
CHOICES.set("paper", ["rock", "spock"]);
CHOICES.set("scissors", ["paper", "lizard"]);
CHOICES.set("lizard", ["spock", "paper"]);
CHOICES.set("spock", ["rock", "scissors"]);

// This builds a map that includes the choices and also the abbreviated choices
// to the shortest possible number of characters while avoiding collisions.
const INPUT_CHOICES = new Map();
CHOICES.forEach((_v, key, _m) => INPUT_CHOICES.set(key, key));
findMinDistinctChars(Array.from(CHOICES.keys()))
  .forEach((value, key, _) => INPUT_CHOICES.set(key.slice(0,value), key));

/**
 * Simply outputs to the console the message, prefixed with a prompt.
 * @param {string} message - The message to display to user.
 */
function prompt(message) {
  console.log(`=> ${message}`);
}

/**
 * Takes an array of words and returns a map with the words as keys and then the
 * number of characters at the start of each word needed to assure that they are
 * distinct.
 * @param {string[]} choicesArray
 * @returns {Map<string, number>}
 */
function findMinDistinctChars(choicesArray) {
  let minDistinctChars = new Map();
  choicesArray.forEach(choice => minDistinctChars.set(choice, 0));

  choicesArray.forEach(choice => {
    choicesArray.forEach(comparisonChoice => {
      if (choice !== comparisonChoice) {
        for (let numChars = 1; numChars <= choice.length; numChars += 1) {
          if (choice.slice(0,numChars) !== comparisonChoice.slice(0,numChars)) {
            if (numChars > minDistinctChars.get(choice)) {
              minDistinctChars.set(choice, numChars);
            }
            break;
          }
        }
      }
    });
  });
  return minDistinctChars;
}

/**
 * Determines who won the game. Will return an error if we didn't define who
 * wins in the CHOICES map.
 * @param {string} userChoice
 * @param {string} computerChoice
 * @returns {string} Should be one of: tie, user, computer. Will be "undefined
 * outcome" in the event a winner isn't defined in the CHOICES map.
 */
function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return "tie";
  } else if (Array.from(CHOICES.get(userChoice)).includes(computerChoice)) {
    return "user";
  } else if (Array.from(CHOICES.get(computerChoice)).includes(userChoice)) {
    return "computer";
  } else {
    return "undefined outcome";
  }
}

/**
 * Displays who won (or if there was a tie).
 * @param {string} outcome
 */
function displayOutcome(outcome) {
  switch (outcome) {
    case 'user':
      prompt('You win!');
      break;
    case 'computer':
      prompt('Computer wins!');
      break;
    case 'tie':
      prompt("It's a tie!");
      break;
    default:
      prompt("There's been an error and the outcome is undefined.");
  }
  console.log('');
}

/**
 * Returns a string that has all the choices and their abbreviations, nicely
 * formatted. For example, if the choices are 'rock', 'paper', 'scissors',
 * 'lizard', 'spock' then it will return the string "rock (r), paper (p),
 * scissors (sc), lizard (l), spock (sp)".
 * @returns {string}
 */
function formatChoices() {
  let formattedChoices = [];
  findMinDistinctChars(Array.from(CHOICES.keys()))
    .forEach((value, key, _) => formattedChoices
      .push(`${key} (${key.slice(0,value)})`));
  return formattedChoices.join(', ');
}

/**
 * Ask the user a question, then validate and return the response.
 * @param {string} question - The question for the user to answer.
 * @param {string[]} possibleChoices - An array of the valid choices.
 * @returns {string}
 */
function getUserInput(question, possibleChoices) {
  prompt(question);
  let response = readline.question().toLowerCase();
  while (!possibleChoices.includes(response)) {
    prompt(`Invalid response, try again. ${question}`);
    response = readline.question().toLowerCase();
  }
  return response;
}

/**
 * Plays a single round of the game and returns the outcome.
 * @returns {string} representing the winner of the round.
 */
function playOneRound() {
  // Get the user's choice.
  let choice = getUserInput(
    `Choose one: ${formatChoices()}`,
    Array.from(INPUT_CHOICES.keys())
  );
  choice = INPUT_CHOICES.get(choice);

  // Generate the computer's choice.
  let randomIndex = Math.floor(Math.random() * CHOICES.size);
  let computerChoice = Array.from(CHOICES.keys())[randomIndex];

  prompt(`You chose ${choice}, computer chose ${computerChoice}`);

  return determineWinner(choice, computerChoice);
}

// This is a scorecard object to track game state.
const scorecard = {
  userScore: 0,
  computerScore: 0,
  /**
   * Increments either user or computer score and ignores other input.
   * @param {string} whichPlayer - Either 'user' or 'computer'.
   */
  incrementScore: function (whichPlayer) {
    if (whichPlayer === 'user') this.userScore += 1;
    else if (whichPlayer === 'computer') this.computerScore += 1;
  },
  /**
   * Checks if either user has scored the NUM_ROUNDS necessary to win.
   * @returns {boolean}
   */
  isMatchOver: function () {
    return (this.userScore >= NUM_ROUNDS || this.computerScore >= NUM_ROUNDS);
  }
};

// The main body of the program.

// Clear screen and welcome user.
console.clear();
prompt('Welcome to ' + Array
  .from(CHOICES.keys())
  .map(word => word[0].toUpperCase() + word.slice(1))
  .join(", "));

// Determine if we're playing best-of-five.
const bestOfFiveAnswer = getUserInput(
  "Would you like to play in best-of-five mode? (y/n)",
  ['y', 'n']
);

if (bestOfFiveAnswer === 'y') {
  while (true) {
    let winner = playOneRound();
    displayOutcome(winner);

    scorecard.incrementScore(winner);

    prompt(`The best of five score is user: ${scorecard.userScore}, computer: `
      + `${scorecard.computerScore}`);
    if (scorecard.isMatchOver()) {
      prompt(`The match is over. `
        + `${(scorecard.computerScore > scorecard.userScore) ? 'The computer is'
          : 'You are'} ` + `the winner!`);
      break;
    }
  }
} else {
  while (true) {
    console.clear();

    let winner = playOneRound();
    displayOutcome(winner);

    let playAgain = getUserInput(
      'Do you want to play again (y/n)?',
      ['y', 'n']
    );
    if (playAgain !== 'y') break;
  }
}