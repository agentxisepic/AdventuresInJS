//This script was purely for testing not actual use
var Person = function(name, yearOfBirth, job) {
  this.name = name;
  this.yearOfBirth = yearOfBirth;
  this.job = job;
}

var john = new Person('John', 1978, 'Designer');

var johnStored = JSON.stringify(john);
var johnRetrevied = JSON.parse(johnStored);

var Question = function(question, possibleAnswers, answer) {
  this.question = question;
  this.possibleAnswers = possibleAnswers;
  this.answer = answer - 1;
  this.method = function() {
    console.log(1 + 6);
  }
}

var question1 = new Question('1 + 2?', [1, 5, 3, 9], 3);
console.log(question1.answer);

var questions = [question1, 1];
var question01, question001, question0001;
function test() {
  //this sets an item in local storage called questions and strigifies the questions array
  sessionStorage.setItem('questions', JSON.stringify(questions));
  //make question01 some kind of temporary variable that changes constantly as it gives us our array of parsed objects
  question01 = JSON.parse(sessionStorage.questions);
  //question001 actually gives us back our initial object
  question001 = question01[0];
  question0001 = new Question(question001.question, question001.possibleAnswers, question001.answer);
}
