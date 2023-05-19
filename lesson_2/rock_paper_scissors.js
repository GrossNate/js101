const readline = require('readline-sync');
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
findMinDistinctChars(Array.from(CHOICES.keys())).forEach((value, key, _) => {
  INPUT_CHOICES.set(key.slice(0,value), key);
});

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
 * Displays a confirmation of what the choices were and then who won (or if
 * there was a tie).
 * @param {string} choice
 * @param {string} computerChoice
 * @param {string} outcome
 */
function displayOutcome(choice, computerChoice, outcome) {
  prompt(`You chose ${choice}, computer chose ${computerChoice}`);
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
  findMinDistinctChars(Array.from(CHOICES.keys())).forEach((value, key, _) => {
    formattedChoices.push(`${key} (${key.slice(0,value)})`);
  });
  return formattedChoices.join(', ');
}

/**
 * Ask the user a question, then validate and return the response.
 * @param {string} question - The question for the user to answer.
 * @param {string[]} possibleChoices - An array of the valid choices.
 * @returns {string}
 */
function getInfo(question, possibleChoices) {
  prompt(question);
  let response = readline.question().toLowerCase();
  while (!possibleChoices.includes(response)) {
    prompt(`Invalid response, try again. ${question}`);
    response = readline.question().toLowerCase();
  }
  return response;
}

// The main body of the program.
let isBestOfFiveMode = false;
let continuePlaying = true;
let score;

console.clear();

// Determine if we're playing best-of-five.
let bestOfFiveAnswer = getInfo(
  "Would you like to play in best-of-five mode? (y/n)",
  ['y', 'n']
);
if (bestOfFiveAnswer === 'y') {
  isBestOfFiveMode = true;
  score = {
    user: 0,
    computer: 0
  };
}

// Play the game.
while (continuePlaying) {
  // If playing best-of-five we want user to see the history, so don't clear.
  if (!isBestOfFiveMode) console.clear();

  // Get the user's choice.
  let choice = getInfo(
    `Choose one: ${formatChoices()}`,
    Array.from(INPUT_CHOICES.keys())
  );
  choice = INPUT_CHOICES.get(choice);

  // Generate the computer's choice.
  let randomIndex = Math.floor(Math.random() * CHOICES.size);
  let computerChoice = Array.from(CHOICES.keys())[randomIndex];

  // Determine the winner of a single round and display that.
  let winner = determineWinner(choice, computerChoice);
  displayOutcome(choice, computerChoice, winner);

  if (isBestOfFiveMode) {
    if (winner === 'user') {
      score.user += 1;
    } else if (winner === 'computer') {
      score.computer += 1;
    }
    prompt(`The best of five score is user: ${score.user}, computer: `
      + `${score.computer}`);
    if (score.user >= 3 || score.computer >= 3) {
      prompt(`The match is over. `
        + `${(score.computer > score.user) ? 'The computer is' : 'You are'} `
        + `the winner!`);
      continuePlaying = false;
    }
  } else {
    let playAgain = getInfo(
      'Do you want to play again (y/n)?',
      ['y', 'n']
    );
    if (playAgain !== 'y') continuePlaying = false;
  }
}