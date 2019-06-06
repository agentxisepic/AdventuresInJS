
var winCounter, displayWinCounter, lossCounter, displayLossCounter, tieCounter, displayTieCounterrock, paper, scissors, userInput, userChoice, computerRandom, computerChoice, outCome, tieConverter, winConverter, lossConverter;

tieCounter = 0;
winCounter = 0;
lossCounter = 0;
rock = 0;
paper = 1;
scissors = 2;
tieConverter = "Ties: " + tieCounter;
winConverter = "Wins: " + winCounter;
lossConverter = "Losses: " + lossCounter;

function playGame() {
  userInput = document.getElementById('userInput').elements["choice"].value;
  computerRandom = Math.floor(Math.random()* 3);
  //takes the random number and assigns the computer choice rock paper or scissors based on its value
  if (computerRandom === 0) {
    computerChoice = rock;
  } else if (computerRandom === 1) {
    computerChoice = paper;
  } else {
    computerChoice = scissors;
  }
  //takes whatever the user inputted and assigns it either rock paper or scissors
  if (userInput === "scissors" || userInput === "Scissors" || userInput === "s" || userInput === "S") {
    userChoice = scissors;
  console.log("Does this even work?");
} else if (userInput === "rock" || userInput === "Rock" || userInput === "r" || userInput === "R") {
    userChoice = rock;
    console.log("Does this even work?");
  } else if (userInput === "paper" || userInput === "Paper" || userInput === "p" || userInput === "P") {
    userChoice = paper;
    console.log("Does this even work?");
  } else {
    outCome = "please choose between rock paper and scissors";
    console.log("Does this even work?");
  }

  //figures out who wins the rock paper scissors game
  if (userChoice === computerChoice) {
    outCome = "It was a tie";
  } else if (userChoice === rock && computerChoice === paper) {
    outCome = "You are a looser";
  } else if (userChoice === rock && computerChoice === scissors) {
    outCome =  "You win! :)";
  } else if (userChoice === paper && computerChoice === rock) {
    outCome = "You win! :)";
  } else if (userChoice === paper && computerChoice === scissors) {
    outCome = "You are a looser";
  } else if (userChoice === scissors && computerChoice === rock) {
    outCome = "You are a looser";
  } else if (userChoice === scissors && computerChoice === paper) {
    outCome = "You win! :)";
  }

  if (outCome === "You win! :)") {
    winCounter += 1;
  } else if (outCome === "You are a looser") {
    lossCounter += 1;
  } else if (outCome === "It was a tie") {
    tieCounter += 1;
  }
  displayLossCounter = document.getElementById('lossCounter').innerHTML = "";
  displayTieCounter = document.getElementById('tieCounter').innerHTML = "";
  displayWinCounter = document.getElementById('winCounter').innerHTML = "";
  displayLossCounter = document.getElementById('lossCounter').innerHTML = lossCounter;
  displayTieCounter = document.getElementById('tieCounter').innerHTML = tieCounter;
  displayWinCounter = document.getElementById('winCounter').innerHTML = winCounter;
  document.getElementById('outcome').innerHTML = outCome;
console.log("Wins: " + winCounter);
}
