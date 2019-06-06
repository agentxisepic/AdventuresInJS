var guessWord, secretWord, bulls, cows;
guessWord = "Bulls";
secretWord = "lbusl";
bulls = 0;
cows = 0;
var testArray = [2, 3];
/*
for (var i = 0; i < secretWord.length; i++) { 
for (var f = 0; f < guessWord.length; f++) { 
if (guessWord[f] === secretWord[i]) { 
console.log(guessWord[f], secretWord[i]); } 
	} 
}
*/
//If the character is the same character in both in the same location in the string then it is a bull
//but if it is the same character as another character in the string and is not in the same place then it is
//a cow.

function checkForSame () {
	if (guessWord === secretWord) {
		return console.log("You win! The word is " + guessWord);
	} else {
		checkForBullsAndCows();
	}
}

function checkForBullsAndCows () {
	for (var i = 0; i < secretWord.length; i++) {
		for (var f = 0; f < guessWord.length; f++) {
			if (guessWord[f] === secretWord[i] && f === i) {
				bulls++;
			} else if (guessWord[f] === secretWord[i] && f != i && f != testArray[0] && f != testArray[1]) {
				cows++;
			}
		}
	}
}
//Only count a letter that occurs more than once in a string as a cow if the letter that is the same in the
//guess string is not in the same position as said letter in the secret string