//DOM Element
const username = document.getElementById("username");
const gameScreen = document.getElementById("gameScreen");
const usernameInput = document.getElementById("usernameInput");
const startButton = document.getElementById("startButton");
const welcomeText = document.getElementById("welcomeText");
const leaderboardList = document.getElementById("leaderboardList");

//shared variable - each game sets this on start
let playerName = "";

//start button click listener
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

//allow enter key to trigger start
usernameInput.addEventListener("keydown", function(e){
    if(e.key === "Enter") startButton.click();
});

//

function showGameScreen(){
    username.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    welcomeText.textContent = `Good luck, ${playerName}!`
}