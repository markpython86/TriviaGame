//global variables
var numberRight;
var numberWrong;
var currentQuestion;
var timer;
var timeToGuess;
var library; // a copy of the questions for this game
// settings
var questionLength = 10; // seconds you have to guess
var answerLength = 3; // seconds you're shown the answer
var gameLength; // set this to limit the number of questions per game

function initGame(){
	// display intro
	$("#qText").html('When you play Trivia of Thrones, you win or you die. Okay, so you won\'t actually die, but some of these questions are very difficult, and you only have 10 seconds to answer, not enough time to google it! Good luck, and <em>Valar Morghulis</em>.<button id="startGame">Begin Game</button>');
	$("#result").hide();
	$("#choices").hide();
	$("#choices li").empty();
	$(".scoreboard").empty();
	//add listeners
	$("#choices .answer").off().on("click", makeGuess);
	$("#startGame").off().on("click", newQuestion);
	//reset game variables
	numberWrong = 0;
	numberRight = 0;
	// creates a fresh clone of the library on each play
	library = questionsLibrary.slice(); 
	timeToGuess = questionLength;
	gameLength = library.length;
}
function newQuestion(){
	if(numberRight + numberWrong >= gameLength){
		gameOver();
	} else {
		//pick a random question that hasn't been asked already
		var questionNumber = Math.floor(Math.random() * library.length);
		currentQuestion = library[questionNumber];
		library.splice(questionNumber, 1);
		resetTimer();
		$("#result").empty().hide();
		$("#qText").html(currentQuestion.question);
		$("#choices").show().find(".answer").each(function(i){
			$(this).html(currentQuestion.answers[i]);
		});
		$("body").css("background-image", "url('"+currentQuestion.image+"')");
		// start Question Timer
		timer = setInterval(showTimer, 1000);
	}
}
function makeGuess(){
	if ($(this).data("choice") == currentQuestion.correctAnswer){
		numberRight++;
		showResult("Correct!", "correctResult");
	} else {
		numberWrong++;
		showResult("Wrong. The correct answer was " + currentQuestion.answers[currentQuestion.correctAnswer], "wrongResult");
	}
}
function showResult(msg, addThisClass){
	resetTimer();
	$("#result")
		.html(msg)
		.show()
		.removeClass()
		.addClass(addThisClass);
	setTimeout(newQuestion, answerLength*1000);
	$("#score").html("correct: " + numberRight + " <br> incorrect: " + numberWrong);

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
	numberWrong++;
	resetTimer();
	showResult("Time's Up! The correct answer was " + currentQuestion.answers[currentQuestion.correctAnswer], "timesUp");
}
function resetTimer(){
	clearInterval(timer);
	timeToGuess = questionLength;
	$("#timer").empty();
}
function gameOver(){
	$("body").css("background-image", 'url("assets/images/init-BG.jpg")');
	var score = (numberRight/gameLength);
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
	$("#result").removeClass().html("<h1>Game Over</h1><div class='gameOverText'>You got " + numberRight + " questions right and " + numberWrong + " wrong. " + praise + "</div><button id='newGame'>Play Again</button>");
	$("#newGame").on("click", initGame);
}
$(document).ready(initGame);