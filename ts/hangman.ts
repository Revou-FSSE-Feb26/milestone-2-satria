const listOfWords: string[] = [
    "javascript",
    "typescript",
    "undefine",
    "null",
    "hangman",
];
let currentWord: string = "";
let guessedLetters: string[] = [];
let chances: number = 6;
let isGameOver: boolean = false;

function startGame(){
    currentWord = listOfWords[Math.floor(Math.random() * listOfWords.length)];
    guessedLetters = [];
    chances = 6;
    isGameOver = false;
    updateDisplay();
}

function updateDisplay(){
    const displayWord = currentWord.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
}