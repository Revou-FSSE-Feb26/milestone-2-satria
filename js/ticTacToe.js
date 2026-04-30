//game state
const PLAYER = {
    X: "X",
    O: "O"
}
let boardState =["","","","","","","","",""];
let currentPlayer = PLAYER.X;
let isGameOver = false;
let playerName ="";
let wins = 0;
let draws = 0;


//winning condition
const WINNING_CONDITION =[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];

//DOM Element
const CELLS = document.querySelectorAll(".box");
const statusDisplay = document.querySelector(".status");
const RESTART_BUTTON = document.querySelector(".restartBtn");
const username = document.getElementById("username");
const gameScreen = document.getElementById("gameScreen");
const usernameInput = document.getElementById("usernameInput");
const startButton = document.getElementById("startButton");
const welcomeText = document.getElementById("welcomeText");
const leaderboardList = document.getElementById("leaderboardList");
const winCount = document.getElementById("winCount");
const drawCount = document.getElementById("drawCount");

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
    //Game Init
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`

    renderLeaderboard();
}

//Event listener on Every box
CELLS.forEach(cell=>{
    cell.addEventListener("click", function(){
        const CELL_INDEX = parseInt(this.getAttribute("data-index"));
        handleCellClick(CELL_INDEX);
    })
})

//Restart button listener
RESTART_BUTTON.addEventListener("click", function(){
    restartGame()
});

//Games Function
function handleCellClick(cellIndex){

    //disable clicking box when the game is over
    if(isGameOver || boardState[cellIndex] !== ""){
        return;
    }

    //update board and display
    boardState[cellIndex] = currentPlayer;
    CELLS[cellIndex].textContent = currentPlayer;

    switch (currentPlayer){
        case PLAYER.X:
            CELLS[cellIndex].style.color = "#00d1ff";
            break;
        case PLAYER.O:
            CELLS[cellIndex].style.color = "#7b61ff";
            break;
    }

    //check for winner
    const WINNER = checkWinner();

    if(WINNER){
        isGameOver = true;
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells(WINNER);

        if(currentPlayer === PLAYER.X){
            wins++;
            winCount.textContent = wins;
            saveScore(playerName, wins);
            renderLeaderboard();
        }
    }else if(boardState.every(cell => cell !== "")){
        isGameOver = true;
        draws++;
        drawCount.textContent = draws;
        statusDisplay.textContent = `It's a draw!`;
    }else {
        currentPlayer = currentPlayer === PLAYER.X ? PLAYER.O : PLAYER.X;
        statusDisplay.textContent = `Player ${currentPlayer} turn`;
    }
}


//function check winner
function checkWinner(){
    for (let i=0; i < WINNING_CONDITION.length; i++) {
        const [a,b,c] = WINNING_CONDITION[i];
        if(boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
            return [a,b,c];
        } 
    }
    return null;
}

//highlight the winning cell
function highlightWinningCells(winningCombo){
    winningCombo.forEach(index => {
        CELLS[index].style.color = "#f4d35e";
        CELLS[index].style.backgroundColor = "#2a2a2a";
    });
}

//function restart
function restartGame(){
    boardState =["","","","","","","","",""];
    currentPlayer = PLAYER.X;
    isGameOver = false;

    CELLS.forEach(cell => {
        cell.textContent = ""; 
        cell.style.color= "white";
        cell.style.backgroundColor= "";   
    });

    statusDisplay.textContent = `Player ${currentPlayer} turns`;
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

    localStorage.setItem("tttLeaderboard", JSON.stringify(top5))
}

function getLeaderboard(){
    const data = localStorage.getItem("tttLeaderboard");
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
        <li class="flex items-center justify-between bg-[#1E1E1E] px-3 py-1.5 rounded-lg">
            <span class="text-gray-300">${medals[index]} ${entry.name}</span>
            <span class="font-[orbitron] text-(--yellow-brand) text-sm font-bold">${entry.score} pts</span>
        </li>
    `).join("");
}