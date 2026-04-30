//DOm Element
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const resultDisplay = document.getElementById("resultDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const attemptDisplay = document.getElementById("attemptDisplay");
const attemptCount = document.getElementById("attemptCount");
const username = document.getElementById("username");
const gameScreen = document.getElementById("gameScreen");
const usernameInput = document.getElementById("usernameInput");
const startButton = document.getElementById("startButton");
const welcomeText = document.getElementById("welcomeText");
const leaderboardList = document.getElementById("leaderboardList");

//Game State
let numberToGuess = 0;
const guessHistory = [];
let score = 0;
let attempt = 5;
let playerName = "";

//username function
startButton.addEventListener("click", function(){
    const name = usernameInput.value.trim();

    if(name ===""){
        usernameInput.style.borderColor = "#f87171"
        usernameInput.placeholder = "Please enter a username!";
        return
    }

    playerName = name;
    startGame();
});

usernameInput.addEventListener("keydown", function(e){
    if(e.key === "Enter") startButton.click();
});

function startGame(){
    username.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    numberToGuess = Math.floor(Math.random() *100) + 1;
    welcomeText.textContent = `Good luck, ${playerName}!`
    
    //initialize display
    attemptCount.textContent = attempt;
    scoreDisplay.textContent = score;

    renderLeaderboard();
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

    if(attempt > 0){
        if(playerGuess === numberToGuess){
        result = `CONGRATS! YOU GUESSED THE NUMBER!`;
        score++;
        scoreDisplay.textContent = score;
        toggleGameInputs(true);
        saveScore(playerName, score);
        renderLeaderboard();

        }else if(playerGuess < numberToGuess){
            result = `TOO LOW! TRY AGAIN. (Guess #${guessHistory.length})`;
            attempt--;
            attemptCount.textContent = attempt;
            guessInput.value = "";
        }else{
            result = `TOO HIGH! TRY AGAIN. (Guess #${guessHistory.length})`;
            attempt--;
            attemptCount.textContent = attempt;
            guessInput.value = "";
        }
        if(attempt === 0 && playerGuess !== numberToGuess){
            result = `GAME OVER! THE NUMBER WAS  (#${numberToGuess})`;
            toggleGameInputs(true);
        }
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

//local storage & leader board

function saveScore(name, newScore){
    const leaderboard = getLeaderboard();

    const existingIndex = leaderboard.findIndex(entry => entry.name === name);

    if(existingIndex !== -1){
        if(newScore > leaderboard[existingIndex].score){
            leaderboard[existingIndex].score = newScore;
        }
    }else{
        leaderboard.push({name, score: newScore});
    }

    leaderboard.sort((a,b)=> b.score - a.score);
    const top5 = leaderboard.slice(0,5);

    localStorage.setItem("guessingLeaderboard", JSON.stringify(top5))
}

function getLeaderboard(){
    const data = localStorage.getItem("guessingLeaderboard");
    return data ? JSON.parse(data) : [];
}

function renderLeaderboard(){
    const leaderboard = getLeaderboard();
    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

    if(leaderboard.length === 0){
        leaderboardList.innerHTML = `<li class="text-gray-600 text-xs text-center">No scores yet. Be the First!</li>`;
        return
    }

    leaderboardList.innerHTML = leaderboard.map((entry,index) => `
        <li class="flex items-center justify-between bg-[#1E1E1E] px-3 py-1.4 rounded-lg">
            <span class="text-gray-300">${medals[index]} ${entry.name}</span>
            <span class="font-[orbitron] text-(--yellow-brand) text-sm font-bold">${entry.score} pts</span>
        </li>
    `).join("");
}