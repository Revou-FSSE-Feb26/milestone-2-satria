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
let aiMode =false;


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
const aiToggle = document.getElementById("aiToggle");
const aiToggleLabel = document.getElementById("aiToggleLabel");
const allTimeWins = document.getElementById("allTimeWins");

function startGame(){
    showGameScreen();
    //Game Init
    statusDisplay.textContent = aiMode ? "Your Turn (X)" : `Player ${currentPlayer}'s turn`;

    const leaderboard = getLeaderboard("tttLeaderboard")
    const entry = leaderboard.find(e => e.name === playerName);
    allTimeWins.textContent = entry ? entry.score : 0;

    renderLeaderboard("tttLeaderboard", leaderboardList);
}

//AI Toggle
if(aiToggle){
    aiToggle.addEventListener("change", function(){
        aiMode = this.checked;
        aiToggleLabel.textContent = aiMode ? "vs AI (you are X)" : "vs Player";
        restartGame();
    });
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

    //In AI mode, ignore clicks when it's O turn
    if(aiMode && currentPlayer === PLAYER.O){
        return;
    }

    placeSymbol(cellIndex, currentPlayer);
}

function placeSymbol(cellIndex, player){
    //step 1: Update board state array and render the symbol in the cell
    boardState[cellIndex] = player;
    CELLS[cellIndex].textContent = currentPlayer;
    CELLS[cellIndex].setAttribute("data-symbol", player);

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
        statusDisplay.textContent = `Player ${player} wins!`;
        highlightWinningCells(WINNER);

        //only count wins for Player X
        if(player === PLAYER.X){
            wins++;
            winCount.textContent = wins;
            saveScore(playerName, wins, "tttLeaderboard");
            renderLeaderboard("tttLeaderboard", leaderboardList);

            const leaderboard = getLeaderboard("tttLeaderboard")
            const entry = leaderboard.find(e => e.name === playerName);
            allTimeWins.textContent = entry ? entry.score : 0;
        }
    }else if(boardState.every(cell => cell !== "")){
        //Step 4: All cells filled with no winner - It's a draw
        isGameOver = true;
        draws++;
        drawCount.textContent = draws;
        statusDisplay.textContent = `It's a draw!`;
    }else {
        //Step 5: No winner yet - switch to the AI
        currentPlayer = currentPlayer === PLAYER.X ? PLAYER.O : PLAYER.X;
        statusDisplay.textContent = aiMode
            ? (currentPlayer === PLAYER.O ? "AI is thinking..." : "Your turn (X)") 
            : `Player ${currentPlayer}'s turn`;
        
        // Let AI move if it's O turn in AI mode
        if(aiMode && currentPlayer === PLAYER.O && !isGameOver){
            setTimeout(doAiMove, 350);
        }
    }
}


//function check winner
function checkWinner(){
    for (const [a,b,c] of WINNING_CONDITION) {
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
        cell.removeAttribute("data-symbol");
    });

    statusDisplay.textContent = aiMode ? "Your turn (X)" : `Player ${currentPlayer}'s turn`;
}

//function for AI
function doAiMove(){
    if(isGameOver) return;
    const cellIndex = getBestMove();
    if(cellIndex !== -1) placeSymbol(cellIndex, PLAYER.O);
}

function getBestMove(){
    let bestScore = -Infinity;
    let bestIndex = -1;

    for(let i=0; i < 9; i++){
        if(boardState[i] ===""){
            boardState[i] = PLAYER.O;
            const score = minimax(boardState, 0, false);
            boardState[i] = "";
            if(score > bestScore){
                bestScore = score;
                bestIndex = i;
            }
        }
    }
    return bestIndex;
}

function minimax(board, depth, isMaximizing){
    const result = evaluateBoard(board);
    if(result !== null) return result;

    if(isMaximizing){
        //AI (O) maximize
        let best = -Infinity;
        for(let i = 0; i < 9; i++){
            if(board[i] ===""){
                board[i] = PLAYER.O;
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] ="";
            }
        }
        return best;
    } else {
        // Humans (X) minimises from AI's Prespective
        let best = Infinity;
        for(let i = 0; i < 9; i++){
            if(board[i] ===""){
                board[i] = PLAYER.X;
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] ="";
            }
        }
        return best;
    }
}

function evaluateBoard(board){
    for (const [a, b, c] of WINNING_CONDITION) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === PLAYER.O ? 10 : -10;
        }
    }
    if (board.every(cell => cell !== "")) return 0; //draw
    return null; //game not over
}