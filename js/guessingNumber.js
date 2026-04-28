const numberToGuess = Math.floor(Math.random() *100) + 1;
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const resultDisplay = document.getElementById("resultDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const attemptDisplay = document.getElementById("attemptDisplay");
const attemptCount = document.getElementById("attemptCount");
let score = 0;
let attempt = 5;

guessButton.addEventListener("click",function(){
    const playerGuess = parseInt(guessInput.value);
    playGuessGame(playerGuess);
});

function playGuessGame(playerGuess){
    let result = "";

    if(attempt > 0){
        if(playerGuess === numberToGuess){
        result = "CONGRATS! YOU GUESSED THE NUMBER!";
        score++;
        scoreDisplay.textContent = score;
        }else if(playerGuess < numberToGuess){
            result = "TOO LOW! TRY AGAIN.";
            attempt--;
            attemptCount.textContent = attempt;
            guessInput.value = "";
        }else if(playerGuess > numberToGuess){
            result = "TOO HIGH! TRY AGAIN.";
            attempt--;
            attemptCount.textContent = attempt;
            guessInput.value = "";
        }
    }else{
        result = "GAME OVER! THE NUMBER WAS " + numberToGuess;
        guessInput.disabled = true;
        guessButton.disabled = true;
    }
    
    resultDisplay.textContent = "RESULT: " + result;
}