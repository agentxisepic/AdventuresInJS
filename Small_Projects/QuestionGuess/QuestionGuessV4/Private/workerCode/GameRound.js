const { parentPort } = require('worker_threads');
const fs = require('fs');

//console.log("hey there");

var HEADERSMAIN = [];
var HEADERSWORKER = [];
var QuestionSet;
var SessionID;
loadHEADERS();

function Player(playerID)
{
  this.playerID = playerID;
  this.score = 0;
  this.questionsRight = 0;
  this.answered = false;
}

var players = [];


var currentQuestion;
var playedQuestions = [];

var alreadyLoaded = false;

function SetQuestionSet(questionSet)
{
  QuestionSet = questionSet;
}

parentPort.on('message', (msg) =>{
  HEADER = msg.HEAD;
  //console.log(msg);
  //console.log(QuestionSet);
  if (HEADER === HEADERSWORKER[0])
  {

  }
  else if (HEADER === HEADERSWORKER[1])
  {

  }
  else if (HEADER === HEADERSWORKER[2])
  {

  }
  else if (HEADER === HEADERSWORKER[3])
  {
    SetQuestionSet(msg.DATA.QUESTIONS.set);
    SessionID = msg.DATA.SESSIONID;
    userID = msg.DATA.USERID;
    //console.log(SessionID);
    console.log(userID);
    var newPlayer = new Player(userID);
    players.push(newPlayer);
  //  console.log(players);
    chooseQuestion();

    //Start Game
  }
  else if (HEADER === HEADERSWORKER[4])
  {
    if (msg.DATA.gameID != SessionID) {return;}
    var newPlayer = new Player(msg.DATA.playerID);
    players.push(newPlayer);

    var UIData = {
      sessionID: SessionID,
      question: currentQuestion
    }
    var dataForMain = assembleDataForMain(HEADERSMAIN[3], UIData);
    parentPort.postMessage(dataForMain);
    //SEND Current Question to Player to Answer
  }
  else if (HEADER === HEADERSWORKER[5])
  {
    var answer = msg.DATA.answer;
    var playerID = msg.DATA.playerID;
    checkForCorrect(playerID, answer);
  }
});

function loadHEADERS(){
  if (alreadyLoaded) {return;}
  var directory = 'S:/Programming/JavaScript/AdventuresInJS/Small_Projects/QuestionGuess/QuestionGuessV4/Private/serverFiles/';
  var MAINFILE = directory + 'HEADERMAIN.json';
  var WORKERFILE = directory + 'HEADERWORKER.json';
  MAINFILE = fs.readFileSync(MAINFILE);
  HEADERSMAIN = JSON.parse(MAINFILE);
  WORKERFILE = fs.readFileSync(WORKERFILE);
  HEADERSWORKER = JSON.parse(WORKERFILE);
  alreadyLoaded = true;
}

function EndGame(){
  var gameOverStats = '';
  var winners = [];
  var highest = 0;
  for (var i = 0; i < players.length; i++)
  {
    if (players[i].score > highest)
    {
      highest = players[i].score;
    }
  }
  for (var i = 0; i < players.length; i++)
  {
    if (players[i].score === highest)
    {
      winners.push(players[i]);
    }
  }
  if (winners.length > 1)
  {
    gameOverStats += 'Tie between: '
    for (var i = 0; i < winners.length; i++)
    {
      gameOverStats += String(winners[i].playerID) + '. ';
    }
  }
  else
  {
    gameOverStats += 'The winner is!: ' + String(winners[0].playerID);
  }
  gameOverStats += ' with a score of: ' + highest;

  var FinalStats = {
    GameOverStats: gameOverStats,
    sessionID: SessionID
  }
  var dataForMain = assembleDataForMain(HEADERSMAIN[4], FinalStats);
  parentPort.postMessage(dataForMain);
}


function chooseQuestion(){
  if (playedQuestions.length === QuestionSet.length)
  {
    EndGame();
    return;
  }
  currentQuestion = QuestionSet[Math.floor(Math.random() * QuestionSet.length)];
  for (var i = 0; i < playedQuestions.length; i++)
  {
    if (playedQuestions[i] === currentQuestion)
    {
      chooseQuestion();
      return;
    }
  }
  playedQuestions.push(currentQuestion);
  var UIData = {
    sessionID: SessionID,
    question: currentQuestion
  }
  var dataForMain = assembleDataForMain(HEADERSMAIN[3], UIData);
  parentPort.postMessage(dataForMain);
  for (var i = 0; i < players.length; i++)
  {
    //console.log(players[i]);
    players[i].answered = false;
  }
  //Send question to be seen by user
}

function checkForCorrect(playerID, answer)
{
  console.log(playerID);
  player = getPlayer(playerID);
  var answerCorrect = false;
  if (!player || player.answered === true) { console.log("Happenend");return; }
  if (answer === currentQuestion.correctAnswer)
  {
    player.answered = true;
    player.score += 1;
    player.questionsRight += 1;
    answerCorrect = true;
    console.log(player.playerID + ' Answered!');
  }
  else {
    player.answered = true;
  }
  var UIData = {
    score: player.score,
    questionsRight: player.questionsRight,
    wasCorrect: answerCorrect,
    gameID:SessionID,
    PlayerID: playerID
  }
  var dataForMain = assembleDataForMain(HEADERSMAIN[2], UIData);
  parentPort.postMessage(dataForMain);
  var allAnswered = true;
  for (var i = 0; i < players.length; i++)
  {
    if (players[i].answered === false)
    {
      allAnswered = false;
      break;
    }
  }
  if(allAnswered){chooseQuestion();}

}

function assembleDataForMain(HEADER, data)
{
    var DataForMain = {
      HEAD: HEADER,
      DATA: data
    }
    return DataForMain;
}

function getPlayer(playerID)
{
  for (var i = 0; i < players.length; i++)
  {
    if (players[i].playerID === playerID)
    {
      return players[i];
    }
  }
  return null;
}
