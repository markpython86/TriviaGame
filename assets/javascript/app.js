//global variables
var numRight;
var numWrong;
var currentQuestion;
var timer;
var timeToGuess;
var timeTilNextQ;
// settings
var questionLength = 10; // seconds you have to guess
var answerLength = 1; // seconds you're shown the answer
var gameLength = 10; // number of questions per round
 function initGame(){
	// display intro
	$("#question").html('When you play Trivia of Thrones, you win or you die. Okay, you won\'t actually die, but some of these questions are very difficult, and you only have 10 seconds to answer, not enough time to google it! Good luck, and <em>Valar Morghulis</em>.<button id="startGame">Begin Game</button>');
	$("#result").hide();
	$("#choices li").empty();
	$(".scoreBoard").empty();
	//add listeners
	$("#choices .answer").on("click", makeGuess);
	$("#startGame").on("click", newQuestion);
	//reset game variables
	numWrong = 0;
	numRight = 0;
	timeToGuess = questionLength;
}
function newQuestion(){
	if(numRight+numWrong === gameLength){
		gameOver();
	} else {
		//pick a random question that hasn't been asked already
		var qNum = Math.floor(Math.random() * questLib.length);
		currentQuestion = questLib[qNum];
		questLib.splice(qNum, 1);
		$("#result").empty().hide();
		$("#question").html(currentQuestion.question);
		$("#choices .answer").each(function(i){
			$(this).html(currentQuestion.answers[i]);
		});
		// start Question Timer
		timer = setInterval(showTimer, 1000);
	}
}
function makeGuess(){
	if ($(this).data("choice") == currentQuestion.correctAnswer){
		numRight++;
		showResult("Correct!", "correctResult");
	} else {
		numWrong++;
		showResult("Wrong. The correct answer was " + currentQuestion.answers[currentQuestion.correctAnswer], "wrongResult");
	}
}
function showResult(msg, addThisClass){
	resetTimer();
	$("#result").html(msg).show().removeClass().addClass(addThisClass);
	setTimeout(newQuestion, answerLength*1000);
$("#score").html("correct: " + numRight + " <br> incorrect: " + numWrong);

}

function showTimer(){
	if (timeToGuess >= 0){
		$("#timer").html(timeToGuess + " seconds left");
		timeToGuess--;
	} else {
		timesUp();
	}
}
function timesUp(){
	numWrong++;
	resetTimer();
	showResult("Time's Up! The correct answer was " + currentQuestion.answers[currentQuestion.correctAnswer], "timesUp");
}
function resetTimer(){
	clearInterval(timer);
	timeToGuess = questionLength;
	$("#timer").empty();
}
function gameOver(){
	var score = (numRight/gameLength);
	var praise = "That was pretty shabby. You get sent to the Wall.";
	if (score > .9){
		praise = "Amazing! You achieved the rank of King of the Seven Kingdoms.";
	} else if (score > .8){
		praise = "Amazing! You achieved the rank of Knight of the Kingsguard.";
	} else if (score > .7){
		praise = "Well done, you achieved the rank of Lord of Harrenhal.";
	} else if (score > .6){
		praise = "Well done, you achieved the rank of Maester.";
	} else if (score > .5){
		praise = "Well done, you achieved the rank of Knight's Squire.";
	} else if (score > .4){
		praise = "Not bad, you achieved the rank of Novice of the Citadel.";
	}
	$("#result").removeClass().html("<h1>Game Over</h1><div class='gameOverText'>You got " + numRight + " questions right and " + numWrong + " wrong. " + praise + "</div><button id='newGame'>New Game</button>");
	$("#newGame").on("click", initGame);
}
$(document).ready(initGame);