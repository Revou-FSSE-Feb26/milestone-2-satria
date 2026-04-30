//DOm Element
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const resultDisplay = document.getElementById("resultDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const attemptDisplay = document.getElementById("attemptDisplay");
const attemptCount = document.getElementById("attemptCount");

//Game State
let numberToGuess = 0;
const guessHistory = [];
let score = 0;
let attempt = 5;

function startGame(){
    showGameScreen();
    numberToGuess = Math.floor(Math.random() *100) + 1;
    //initialize display
    attemptCount.textContent = attempt;
    scoreDisplay.textContent = score;

    renderLeaderboard("guessingLeaderboard", leaderboardList);
}

//event listener for input number
guessButton.addEventListener("click",function(){
    const playerGuess = parseInt(guessInput.value);
    playGuessGame(playerGuess);
});

guessInput.addEventListener("keydown",function(e){
    if (e.key === "Enter") guessButton.click();
});

//Function for the Guessing games
function playGuessGame(playerGuess){
    let result = "";

    //validate the input only 1-100 number
    if(isNaN(playerGuess) || playerGuess < 1 || playerGuess > 100){
        resultDisplay.textContent = `Please enter a number between 1 to 100`;
        return
    }

    //storing guess in history array
    guessHistory.push(playerGuess);

    if(attempt <= 0) return;

    //Determine if guess is correct, too low, or too high
    switch (true){
        case playerGuess === numberToGuess:
            result = `CONGRATS! YOU GUESSED THE NUMBER! ${numberToGuess}`;
            score++;
            scoreDisplay.textContent = score;
            toggleGameInputs(true);
            saveScore(playerName, score, "guessingLeaderboard");
            renderLeaderboard("guessingLeaderboard", leaderboardList);
            break;
        case playerGuess < numberToGuess:
            attempt--;
            attemptCount.textContent = attempt;
            guessInput.value = "";
            result = attempt === 0 
                ? `GAME OVER! THE NUMBER WAS  (#${numberToGuess})` 
                : `TOO LOW! TRY AGAIN. (Guess #${guessHistory.length})`;
            if(attempt === 0) toggleGameInputs(true);
            break;
        case playerGuess > numberToGuess:
            attempt--;
            attemptCount.textContent = attempt;
            guessInput.value = "";
            result = attempt === 0 
                ? `GAME OVER! THE NUMBER WAS  (#${numberToGuess})` 
                : `TOO HIGH! TRY AGAIN. (Guess #${guessHistory.length})`;
            if(attempt === 0) toggleGameInputs(true);
            break;
    }

    resultDisplay.textContent = `RESULT: ${result}`;
}

//function to disabled bnutton and input after game over
function toggleGameInputs(disabled){
    guessInput.disabled = disabled;
    guessButton.disabled = disabled;

    if(disabled){
        guessButton.textContent = "Game Over!"
        guessButton.style.opacity = "0.5"
    }
}