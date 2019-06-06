//Line 1 to line 78 is the code that plays the game
var Question = function(question, possibleAnswers, correctAnswer) {
  this.question = question;
  this.possibleAnswers = possibleAnswers;
  this.correctAnswer = correctAnswer;
  this.outputQuestion = function () {
    this.numberOfAnswers = '';
    for (var i = 0; i < this.possibleAnswers.length; i++) {
      if (this.possibleAnswers[i] === undefined) {
        continue;
      } else {
        this.numberOfAnswers += '\n' + i + ': ' + this.possibleAnswers[i];
      }
    }
    console.log(this.question + this.numberOfAnswers);
  }
  this.isCorrect = function () {
    if (userAnswer === 'exit') {
        return;
    } else if (Number(userAnswer) === this.correctAnswer && userAnswer !== '') {
      questionsRight += 1;
      console.log('You win!\n' + 'Total correct: ' + questionsRight);
      chooseQuestion();
    } else {
      console.log('You are wrong');
      playGame();
    }
  }
  this.addQuestion = function (newQuestionName) {
    newQuestionName = window['question' + addCounter];
    questions.push(newQuestionName);
    return addCounter++;
  }
}


function createQuestion () {
  var userQuestion = String(document.getElementById('inputQuestion').value);
  for (var i = 1; i <= 4; i++) {
    if (String(document.getElementById('answer' + i).value) === "") {
      continue;
    } else {
      window['answer' + i] = String(document.getElementById('answer' + i).value);
    }
  }
  var userCorrect = Number(document.getElementById('correctAnswer').value - 1);
  if (userCorrect < 0 || userCorrect > 3) {
    return console.log('correct answer on question was logged incorrectly');
  }
  window['question' + addCounter] = new Question(userQuestion, [answer1, answer2, answer3, answer4], userCorrect);
  window['question' + addCounter].addQuestion();
}

var addCounter = 0;
var questionsRight = 0;
var currentQuestion;
var userAnswer;
var questions = [];

function chooseQuestion () {
  var randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  randomQuestion.outputQuestion();
  return currentQuestion = randomQuestion, playGame();
}
function playGame() {
  userAnswer = prompt('Please enter your answer to the question');
  currentQuestion.isCorrect();
}
function clearFields() {
  document.getElementById('inputQuestion').value = '';
  document.getElementById('correctAnswer').value = '';
  for (var i = 1; i <= 4; i++) {
    document.getElementById('answer' + i).value = '';
  }
}


function makeSet () {
  var name = document.getElementById('nameOfSetPUSH').value;
  localStorage.setItem(name, JSON.stringify(questions));
}

function clearPool () {
  questions = [];
}

function retrieveSet () {
  questions = [];
  var name = document.getElementById('nameOfSetPULL').value;
  var arrayOfQuestions = JSON.parse(localStorage.getItem(name));
  for (var i = 0; i < arrayOfQuestions.length; i++) {
    window['question' + i] = new Question(arrayOfQuestions[i].question, arrayOfQuestions[i].possibleAnswers, arrayOfQuestions[i].correctAnswer);
    questions.push(window['question' + i]);
  }
}

function showSets () {
  var availableSets = 'Available Sets:';
  for (i = 0; i < Object.keys(localStorage).length; i++) {
    i === 0 ? availableSets += ' ' + Object.keys(localStorage)[i] : availableSets += ', ' + Object.keys(localStorage)[i];
  }
  document.getElementById('showHide').style.visibility = "visible";
  document.getElementById('showHide').innerHTML = availableSets;
}

function hideSets () {
  document.getElementById('showHide').style.visibility = "hidden";
}

function deleteSet () {
  var name = String(document.getElementById('nameOfSetDelete').value);
  localStorage.removeItem(name);
}

function deleteAll () {
  localStorage.clear();
}
