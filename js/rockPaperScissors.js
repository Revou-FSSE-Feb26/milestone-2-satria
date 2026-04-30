//DOM Element
const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("resultDisplay");
const playerScoreDisplay = document.getElementById("playerScoreDisplay");
const computerScoreDisplay = document.getElementById("computerScoreDisplay");
const username = document.getElementById("username");
const gameScreen = document.getElementById("gameScreen");
const usernameInput = document.getElementById("usernameInput");
const startButton = document.getElementById("startButton");
const welcomeText = document.getElementById("welcomeText");
const leaderboardList = document.getElementById("leaderboardList");

//Game State
const choices = ["rock", "paper", "scissors"];
const choiceEmoji = {
    rock:"👊",
    paper: "🤚",
    scissors:"✌️",
};
let playerScore = 0;
let computerScore = 0;
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
    welcomeText.textContent = `Good luck, ${playerName}!`
    
    //initialize display
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;

    renderLeaderboard();

    //Event Listener for button Rock-Paper-Scissors
    const buttons = document.querySelectorAll(".choices button");
    buttons.forEach(button =>{
        button.addEventListener("click", function(){
            const playerChoice = this.getAttribute("data-choice");
            playRockPaperScissors(playerChoice);
        });
    });

    
}

//Function for the Rock-Paper-Scissors
function playRockPaperScissors(playerChoice) {
    //computer choose random choices from the array
    const computerChoice = choices[Math.floor(Math.random()*choices.length)]

    let result = "";

    //check if it's a tie
    if(playerChoice === computerChoice){
        result = "IT'S A TIE!";
    }
    else{
        //determine if player wins or lose
        switch(playerChoice){
            case "rock":
                result = (computerChoice === "scissors") ? "YOU WIN!" : "YOU LOSE!";
                break;
            case "paper":
                result = (computerChoice === "rock") ? "YOU WIN!" : "YOU LOSE!";
                break;
            case "scissors":
                result = (computerChoice === "paper") ? "YOU WIN!" : "YOU LOSE!";
                break;
                
        }
    }

    playerDisplay.textContent = `PLAYER: ${choiceEmoji[playerChoice]} ${playerChoice.toUpperCase()}`;
    computerDisplay.textContent = `COMPUTER: ${choiceEmoji[computerChoice]} ${computerChoice.toUpperCase()}`;
    resultDisplay.textContent = `RESULT: ${result}`;

    //removing the previous resukt color
    resultDisplay.classList.remove("green", "red");

    //updating score and color based on the result
    switch(result){
        case "YOU WIN!":
            resultDisplay.classList.add("green");
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            saveScore(playerName, playerScore);
            renderLeaderboard();
            break;
        case "YOU LOSE!":
            resultDisplay.classList.add("red");
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            break;
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

    localStorage.setItem("rpsLeaderboard", JSON.stringify(top5))
}

function getLeaderboard(){
    const data = localStorage.getItem("rpsLeaderboard");
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
