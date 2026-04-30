//game state
const PLAYER = {
    X: "X",
    O: "O"
}
let boardState =["","","","","","","","",""];
let currentPlayer = PLAYER.X;
let isGameOver = false;
let wins = 0;
let draws = 0;


//winning condition stores all 8 possible winning combination:
//3 rows, 3 columns, and 2 diagonals - each as an array of cell indices
const WINNING_CONDITION =[
    [0,1,2], //top row
    [3,4,5], //middle row
    [6,7,8], //bottom row
    [0,3,6], //left column
    [1,4,7], //middle column
    [2,5,8], //right column
    [0,4,8], //diagonal top-left top bottom-right
    [2,4,6], //diagonal top-right top bottom-left
];

//DOM Element
const CELLS = document.querySelectorAll(".box");
const statusDisplay = document.querySelector(".status");
const RESTART_BUTTON = document.querySelector(".restartBtn");
const winCount = document.getElementById("winCount");
const drawCount = document.getElementById("drawCount");

function startGame(){
    showGameScreen();
    //Game Init
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`

    renderLeaderboard("tttLeaderboard", leaderboardList);
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

    //disable clicking box when the game is over or the cell is taken
    if(isGameOver || boardState[cellIndex] !== ""){
        return;
    }

    //step 1: Update board state array and render the symbol in the cell
    boardState[cellIndex] = currentPlayer;
    CELLS[cellIndex].textContent = currentPlayer;

    //step 2: Apply player color - X gets blue, O get purple
    switch (currentPlayer){
        case PLAYER.X:
            CELLS[cellIndex].style.color = "#00d1ff";
            break;
        case PLAYER.O:
            CELLS[cellIndex].style.color = "#7b61ff";
            break;
    }

    //Step 3: Check if the current move resulted in a win
    const WINNER = checkWinner();

    if(WINNER){
        //win detected - end game, highlight winning cell, update score
        isGameOver = true;
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells(WINNER);

        //only count wins for Player X
        if(currentPlayer === PLAYER.X){
            wins++;
            winCount.textContent = wins;
            saveScore(playerName, wins, "tttLeaderboard");
            renderLeaderboard("tttLeaderboard", leaderboardList);
        }
    }else if(boardState.every(cell => cell !== "")){
        //Step 4: All cells filled with no winner - It's a draw
        isGameOver = true;
        draws++;
        drawCount.textContent = draws;
        statusDisplay.textContent = `It's a draw!`;
    }else {
        //Step 5: No winner yet - switch to the other player
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

    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}