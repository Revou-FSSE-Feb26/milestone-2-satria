let boardState =["","","","","","","","",""];
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
let currentPlayer = "X";
let isGameOver = false;
const CELLS = document.querySelectorAll(".box");


CELLS.forEach(cell=>{
    cell.addEventListener("click", function(){

        const CELL_INDEX = parseInt(this.getAttribute("data-index"));
        handleCellClick(CELL_INDEX);
    })
})


function handleCellClick(cellIndex){
    let result = "";
    let isWin = false;

    if(isGameOver || boardState[cellIndex] !== ""){
        return;
    }

    boardState[cellIndex] = currentPlayer;
    CELLS[cellIndex].textContent = currentPlayer;


    for (let i=0; i < WINNING_CONDITION.length; i++) {
        const [a,b,c] = WINNING_CONDITION[i];
        if(boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
            isWin = true;
            isGameOver = true;
            result = "Player " + currentPlayer + "'s wins!";
            break;
        } 
    }
    if(!isWin){
        if(boardState.every(cell => cell !== "")){
            isGameOver = true;
            result = "It's a draw!";
        }else{
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            isGameOver = false;
            document.querySelector(".status").textContent = "Player " + currentPlayer + "'s turn";
        }
    }; 

    if(isGameOver){
        document.querySelector(".status").textContent = result;
    }
}

const RESTART_BUTTON = document.querySelector(".restartBtn");
RESTART_BUTTON.addEventListener("click", function(){
    restartGame()
});

function restartGame(){
    boardState =["","","","","","","","",""];
    currentPlayer = "X";
    isGameOver = false;
    CELLS.forEach(cell => cell.textContent = "");
    document.querySelector(".status").textContent = "Player " + currentPlayer + "'s turn";
}