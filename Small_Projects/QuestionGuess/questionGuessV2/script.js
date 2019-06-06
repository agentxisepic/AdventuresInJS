//Establishing the blueprint for our question Object that we can create more of with the Object.create keyword
var questionProto = {
  question: '',
  possibleAnswers: [],
  correctAnswer: Number,
  outputQuestion: function () {
    this.numberOfAnswers = '';
    for (var i = 0; i < this.possibleAnswers.length; i++) {
      if (this.possibleAnswers[i] === undefined){
        continue;
      } else {
      this.numberOfAnswers += '\n' + i + ': ' + this.possibleAnswers[i];
    }
  }
    console.log(this.question + this.numberOfAnswers);
  },
  isCorrect: function () {
    if (Number(userAnswer) === this.correctAnswer) {
      questionsRight += 1;
      console.log('You win!\n' + 'Total correct: ' + questionsRight);
      chooseQuestion();
    } else if (userAnswer === 'exit') {
        return;
    } else {
      console.log('Looser');
      playGame();
    }
  },
  addQuestion: function (newQuestionName) {
    newQuestionName = window['question' + addCounter];
    questions.push(newQuestionName);
    return addCounter++;
  }
};

var question1 = Object.create(questionProto, {
    question: {value: 'Is JavaScript the best programming language in the world?'},
    possibleAnswers: {value: ['Yes', 'No', 'Maybe']},
    correctAnswer: {value: 0}
});

var question2 = Object.create(questionProto, {
  question: {value: 'Who is the course instructor?'},
  possibleAnswers: {value: ['Mark', 'John', 'Jonas', 'Jane']},
  correctAnswer: {value: 2}
});

var question3 = Object.create(questionProto, {
  question: {value: 'Isn\'t the prototype chain cool?'},
  possibleAnswers: {value: ['Yes', 'Fuck Yes', 'No', 'Isn\'t that one of the really boring parts of the JavaScript backend?']},
  correctAnswer: {value: 1}
});

var question4 = Object.create(questionProto, {
  question: {value: 'What is a constituent?'},
  possibleAnswers: {value: ['A person in a geographic area represented by a memeber of government', 'IDK']},
  correctAnswer: {value: 0}
});

var userQuestion, answer1, answer2, answer3, answer4, userCorrect;
function createObject () {
  userQuestion = String(document.getElementById('inputQuestion').value);
  for (var i = 1; i <= 4; i++) {
    if (String(document.getElementById('answer' + i).value) === undefined || String(document.getElementById('answer' + i).value) === "") {
      continue;
    } else{
    window['answer' + i] = String(document.getElementById('answer' + i).value);
  }
  }
  userCorrect = Number(document.getElementById('correctAnswer').value);
  if (userCorrect === 1) {
    userCorrect = 0;
  } else if (userCorrect === 2) {
    userCorrect = 1;
  } else if (userCorrect === 3) {
    userCorrect = 2;
  } else if (userCorrect === 4) {
    userCorrect = 3;
  } else {
    return console.log('correct answer on question was logged incorrectly');
  }
  window['question' + addCounter] = Object.create(questionProto, {
    question: {value: userQuestion},
    possibleAnswers: {value: [answer1, answer2, answer3, answer4]},
    correctAnswer: {value: userCorrect}
  });
  questionProto.addQuestion();
}

var addCounter = 5;
var questionsRight = 0;
var currentQuestion;
var userAnswer;
var questions = [question1, question2, question3, question4];

function chooseQuestion () {
var randomQuestion = questions[Math.floor(Math.random() * questions.length)];
randomQuestion.outputQuestion();
return currentQuestion = randomQuestion, playGame();
}

function playGame () {
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
