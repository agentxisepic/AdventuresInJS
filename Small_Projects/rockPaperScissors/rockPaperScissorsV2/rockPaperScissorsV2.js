
var winCounter, lossCounter, tieCounter, rock, paper, scissors, outCome, userChoice, computerChoice, userInput, possibleChoice;

possibleChoice = ['Rock', 'rock', 'r', 'Paper', 'paper', 'p', 'Scissors', 'scissors', 's'];
tieCounter = 0;
winCounter = 0;
lossCounter = 0;
rock = 1;
paper = 2;
scissors = 3;
outCome = document.getElementById('outcome');

function playGame() {
  userInput = String(document.getElementById('userInput').elements['choice'].value);
  userChoice = undefined;
  for (var i = 0; i < possibleChoice.length + 1; i++) {
    if (userInput === possibleChoice[i]) {
      if (i >= 0 && i < 3) {
        userChoice = rock;
      } else if (i >= 3 && i < 6) {
        userChoice = paper;
      } else if (i >= 6 && i <10) {
        userChoice = scissors;
      }
    }
  }
  if (userChoice === undefined) {
    outcome.innerHTML = "please enter rock paper or scissors";
    return;
  }
  computerChoice = Math.floor(Math.random()* 3);
  if (computerChoice === 0) {
    computerChoice = rock;
  } else if (computerChoice === 1) {
    computerChoice = paper;
  } else {
    computerChoice = scissors;
  }
  if (userChoice === computerChoice) {
    outCome.innerHTML = "It was a tie";
    tieCounter += 1;
  } else if (userChoice === rock && computerChoice === paper || userChoice === paper && computerChoice === scissors || userChoice === scissors && computerChoice === rock ) {
    outCome.innerHTML = "You are a looser";
    lossCounter += 1;
  } else if (userChoice === rock && computerChoice === scissors || userChoice === paper && computerChoice === rock || userChoice === scissors && computerChoice === paper) {
    outCome.innerHTML =  "You win! :)";
    winCounter += 1;
  }
  document.getElementById('winCounter').innerHTML = "Wins: " + String(winCounter);
  document.getElementById('lossCounter').innerHTML = "Losses: " + String(lossCounter);
  document.getElementById('tieCounter').innerHTML = "Ties: " + String(tieCounter);
}
