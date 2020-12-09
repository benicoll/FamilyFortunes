var incorrectGuesses, correctGuesses, answerRow, scoreRow;

window.onload = function(){
	for(var i = 0; i<answers.length; i++){
		answerRow = '<div class="answer" id="' + stripWhitespace(answers[i].value) + '">' +
		                '    <div class="answer__number">' + parseInt(i + 1) + '</div>' +
		                '    <div class="answer__value"><span style="display: none;">' + answers[i].value + '</span></div>' +
		                '    <div class="answer__stat"><span style="display: none;">' + answers[i].stat + '</span></div>' +
		                '</div>';

		$('#answerTable').append(answerRow);
	}
	scoreRow = '<div class="answer" id="totalScore">' +
					'    <div class="answer__number"></div>' +
					'    <div class="answer__value"><span>total</span></div>' +
					'    <div class="answer__stat"><span id="runningTotal">0</span></div>' +
					'</div>';
	$('#answerTable').append(scoreRow);

	incorrectGuesses = JSON.parse(localStorage.getItem('incorrectGuesses') || "[]");
	correctGuesses = JSON.parse(localStorage.getItem('correctGuesses') || "[]");

	resetGuessStorage();
};


$('form').submit(function(e){
	e.preventDefault();

	var $input = $('form input#guess');
	var guess = $input.val().toLowerCase();
	var answer = checkAnswer(guess);

	if(guess != ''){
		if(answer != null){
			if (answer.bonus) {
				bonusAudio.play();
			}
			else {
				correctAudio.play();
			}
			correctGuesses.push(guess);
			localStorage.setItem('correctGuesses', JSON.stringify(correctGuesses));

			$('#' + stripWhitespace(guess) + ' span').show();
			currentTotal = parseInt($('#runningTotal').text());
			console.log(currentTotal);
			$('#runningTotal').text(currentTotal + answer.stat);

			if(incorrectGuesses.length == 3){
				outOfGuesses();
			}

		} else {
			wrongAudio.play();
			incorrectGuesses.push(guess);
			localStorage.setItem('incorrectGuesses', JSON.stringify(incorrectGuesses));

			showCross();

			$('ul#guessList').append('<li>' + guess + '</li>');

			if(incorrectGuesses.length >= 4){
				outOfGuesses();
			}
		}
	}

	$input.val('');
});

function outOfGuesses() {
	$('form input#submit').prop("disabled", true);
	$('#showAnswers').show();
}

function checkAnswer(guess){
	for(var i = 0; i<answers.length; i++){
		if(answers[i].value.toLowerCase() == guess){
			return answers[i];
		}
	}

	return null;
}

function showCross(number){
	if(number == null){
		$('#crosses img.hidden').first().removeClass('hidden').addClass('show');
	}else{
		$('#crosses img.hidden').slice(0,number).removeClass('hidden').addClass('show');
	}
}

function revealGuesses(){
	for(var i = 0; i<incorrectGuesses.length; i++){
		$('ul#guessList').append('<li>' + incorrectGuesses[i] + '</li>');
	}

	for(var c = 0; c<correctGuesses.length; c++){
		$('#' + correctGuesses[c] + ' span').show();
	}

	showCross(incorrectGuesses.length);

	if(incorrectGuesses.length >= 3){
		$('#showAnswers').show();
		$('form input#submit').prop("disabled", true);
	}
}

function stripWhitespace(sentence) {
	return sentence.replace(/\s/g, '');
}

function resetGuessStorage() {
	localStorage.removeItem('incorrectGuesses');
	incorrectGuesses = [];
	localStorage.removeItem('correctGuesses');
	correctGuesses = [];
}

$('#clear').on('click', function(){
	resetGuessStorage();
	location.reload();
});

$('#showAnswers').on('click', function(){
	$('.answer span').show();
});


var wrongAudio = document.createElement('audio');
wrongAudio.setAttribute('src', 'assets/audio/wrong.mp3');

var correctAudio = document.createElement('audio');
correctAudio.setAttribute('src', 'assets/audio/correct.wav');

var bonusAudio = document.createElement('audio');
bonusAudio.setAttribute('src', 'assets/audio/siren.mp3');
