var socket = io();
console.log("Running");

socket.on('connected', (data) =>{
  userID = data;
  console.log(userID);
});

var userID;
function createQuestion(){
  var questionString = String(document.getElementById('inputQuestion').value);
  var correctAnswer = Number(document.getElementById('correctAnswer').value - 1);
  var answers = [];

  for (var i = 1; i < 5; i++)
  {
    var answer = String(document.getElementById('answer' + i).value);
    if (answer === "") {
      continue;
    }
    else
    {
      answers.push(answer);
    }
  }

  if (correctAnswer < 0 || correctAnswer > 3)
  {
    return console.log('correct answer on question was logged incorrectly');
  }

  var newQuestion = new Question(questionString, answers, correctAnswer);
  questions.push(newQuestion);
}


var addCounter = 0;
var questionsRight = 0;
var currentQuestion;
var userAnswer;
var questions = [];

var gameID = null;

function logQuestions(){
  for (var i = 0; i < questions.length; i++){
    console.log(questions[i]);
  }
}







//Server Talking
function makeSet(){
  var nameOfSet = String(document.getElementById('nameOfSetPUSH').value);
  console.log(nameOfSet);
  var newSet = {name: nameOfSet, set: questions};
  socket.emit('SaveSet', newSet);
}

function displaySets(){
  socket.emit('RetrieveListOfSets', null);
}

socket.on('RecieveListOfSets', (sets) =>{
  var availableSets = 'Available Sets:';
  for (var i = 0; i < sets.length; i++)
  {
    availableSets += ' ' + sets[i] + ',';
  }

  document.getElementById('showHide').style.visibility = "visible";
  document.getElementById('showHide').innerHTML = availableSets;
});

function deleteSet(){
  var setName = String(document.getElementById('nameOfSetDelete').value);
  console.log(setName);
  if (setName === ''){return;}
  socket.emit('DeleteSet', setName);
}


function playGame(){
  if (gameID === null)
  {
    var SetName = String(document.getElementById('nameOfSet').value);
    if (SetName === ''){return;}
    var obj = {
      setName : SetName
    }
    socket.emit('PlayGame', obj, function(res){
      console.log(res);
      gameID = res;
    });
  }
}


socket.on('DisplayQuestion', (data) => {
  var ID = data.sessionID;
  if (ID === gameID)
  {
    console.log(data.question);
    var question = data.question;

    if (question === currentQuestion){return;}
    DisplayQuestion(question);
    currentQuestion = question;
  }

});

socket.on('UpdatePlayerStats', (stats) =>{
  if (stats.gameID === gameID && stats.PlayerID === userID)
  {
    var playerScore = stats.score;
    var questionsRight = stats.questionsRight;
    var correct = stats.wasCorrect;
    document.getElementById('PlayerStatsLine').innerHTML = 'PlayerScore: ' + playerScore + ' QuestionsRight: ' + questionsRight + ' AnswerCorrect: ' + correct;
  }
});

function DisplayQuestion(question)
{
  document.getElementById('QuestionQuestion').innerHTML = question.questionString;
  for (var i = 1; i <= question.possibleAnswers.length; i++)
  {
    var AnswerField = 'PAnswer' + String(i);
    console.log(AnswerField);
    document.getElementById(AnswerField).innerHTML = String(i - 1) + ': ' + question.possibleAnswers[i - 1];
  }
}

var Question = function(questionString, possibleAnswers, correctAnswer) {
  this.questionString = questionString;
  this.possibleAnswers = possibleAnswers;
  this.correctAnswer = correctAnswer;
}


function SubmitAnswer()
{
  var answer = Number(document.getElementById('PlayerAnswer').value);
  socket.emit('SubmitAnswer', answer);
}


function joinGame(){
    var GameID = Number(document.getElementById('gameIDToJoin').value);
    socket.emit('JoinGame', GameID);
    gameID = GameID;

}

socket.on('GameOver', (data) =>{
  if (data.sessionID === gameID)
  {
    var finalString = data.GameOverStats;
    document.getElementById('PlayerStatsLine').innerHTML = finalString;
    socket.emit('EndGame', null);
    gameID = null;
  }


});
