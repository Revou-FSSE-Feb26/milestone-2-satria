//DOM Element
const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("resultDisplay");
const playerScoreDisplay = document.getElementById("playerScoreDisplay");
const computerScoreDisplay = document.getElementById("computerScoreDisplay");

//Game State
const choices = ["rock", "paper", "scissors"];
const choiceEmoji = {
    rock:"👊",
    paper: "🤚",
    scissors:"✌️",
};
let playerScore = 0;
let computerScore = 0;

function startGame(){
    showGameScreen();
    //initialize display
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = computerScore;

    renderLeaderboard("rpsLeaderboard", leaderboardList);

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
            saveScore(playerName, playerScore, "rpsLeaderboard");
            renderLeaderboard("rpsLeaderboard", leaderboardList);
            break;
        case "YOU LOSE!":
            resultDisplay.classList.add("red");
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            break;
    }
}