/* ============================================================
   hangman.ts
   Add  export {}  at the top so TS treats this as an
   ES module — prevents name clashes with pacman.ts when
   both live in the same ts/ folder under one tsconfig.
   ============================================================ */

/* ── Globals from leaderboard.js ── */
declare function saveScore(
    name: string,
    score: number,
    storageKey: string,
): void;
declare function renderLeaderboard(
    storageKey: string,
    listElement: HTMLElement,
): void;

const hm_STORAGE_KEY = "hangman_leaderboard";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface WordEntry {
    word: string;
    category: string;
}
type GameStatus = "playing" | "won" | "lost";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const MAX_WRONG = 6;

const WORD_BANK: WordEntry[] = [
    { word: "javascript", category: "Programming" },
    { word: "typescript", category: "Programming" },
    { word: "algorithm", category: "Programming" },
    { word: "variable", category: "Programming" },
    { word: "function", category: "Programming" },
    { word: "recursion", category: "Programming" },
    { word: "interface", category: "Programming" },
    { word: "component", category: "Web Dev" },
    { word: "database", category: "Web Dev" },
    { word: "responsive", category: "Web Dev" },
    { word: "tailwind", category: "Web Dev" },
    { word: "gradient", category: "Design" },
    { word: "typography", category: "Design" },
    { word: "contrast", category: "Design" },
    { word: "spectrum", category: "Science" },
    { word: "quantum", category: "Science" },
    { word: "nebula", category: "Science" },
    { word: "entropy", category: "Science" },
    { word: "pixel", category: "Gaming" },
    { word: "arcade", category: "Gaming" },
    { word: "dungeon", category: "Gaming" },
    { word: "joystick", category: "Gaming" },
];

const BODY_PARTS: string[] = [
    "hm-head",
    "hm-body",
    "hm-larm",
    "hm-rarm",
    "hm-lleg",
    "hm-rleg",
];

/* ─────────────────────────────────────────
   GAME STATE
───────────────────────────────────────── */
let currentEntry: WordEntry;
let guessedLetters: Set<string>;
let wrongCount: number;
let gameStatus: GameStatus;
let hm_currentUsername = "";
let sessionWins = 0;
let sessionLosses = 0;

/* ─────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────── */
const hm_usernameScreen = document.getElementById(
    "username-screen",
) as HTMLElement;
const hm_gameScreen = document.getElementById("game-screen") as HTMLElement;
const hm_usernameInput = document.getElementById(
    "username-input",
) as HTMLInputElement;
const hm_startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const hm_changeUserBtn = document.getElementById(
    "change-user-btn",
) as HTMLButtonElement;
const hm_welcomeText = document.getElementById(
    "welcome-text",
) as HTMLParagraphElement;
const wordDisplayEl = document.getElementById("word-display") as HTMLDivElement;
const keyboardEl = document.getElementById("keyboard") as HTMLDivElement;
const wrongCountEl = document.getElementById("wrong-count") as HTMLSpanElement;
const livesPipsEl = document.getElementById("lives-pips") as HTMLDivElement;
const categoryEl = document.getElementById(
    "category-text",
) as HTMLParagraphElement;
const scoreWinsEl = document.getElementById("score-wins") as HTMLDivElement;
const scoreLossesEl = document.getElementById("score-losses") as HTMLDivElement;
const overlayEl = document.getElementById("overlay") as HTMLDivElement;
const overlayTitleEl = document.getElementById(
    "overlay-title",
) as HTMLHeadingElement;
const overlayWordEl = document.getElementById(
    "overlay-word",
) as HTMLParagraphElement;
const overlayEmojiEl = document.getElementById(
    "overlay-emoji",
) as HTMLParagraphElement;
const playAgainBtn = document.getElementById(
    "play-again-btn",
) as HTMLButtonElement;
const leaderboardListEl = document.getElementById(
    "leaderboard-list",
) as HTMLOListElement;

/* ─────────────────────────────────────────
   USERNAME
───────────────────────────────────────── */
function hm_enterGame(): void {
    const name = hm_usernameInput.value.trim();
    if (!name) {
        hm_usernameInput.focus();
        hm_usernameInput.classList.add("border-red-400");
        return;
    }
    hm_usernameInput.classList.remove("border-red-400");
    hm_currentUsername = name;
    hm_usernameScreen.classList.add("hidden");
    hm_gameScreen.classList.remove("hidden");
    hm_welcomeText.textContent = `// playing as: ${hm_currentUsername} //`;
    sessionWins = 0;
    sessionLosses = 0;
    updateScoreDisplay();
    renderLeaderboard(hm_STORAGE_KEY, leaderboardListEl);
    hm_startGame();
}

function exitToUsernameScreen(): void {
    hm_gameScreen.classList.add("hidden");
    hm_usernameScreen.classList.remove("hidden");
    overlayEl.classList.remove("active");
    hm_usernameInput.value = "";
}

/* ─────────────────────────────────────────
   GAME INIT
───────────────────────────────────────── */
function hm_startGame(): void {
    currentEntry = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    guessedLetters = new Set<string>();
    wrongCount = 0;
    gameStatus = "playing";
    overlayEl.classList.remove("active");
    BODY_PARTS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    renderWord();
    renderKeyboard();
    renderLives();
    updateWrongCount();
    categoryEl.textContent = currentEntry.category;
}

/* ─────────────────────────────────────────
   RENDER
───────────────────────────────────────── */
function renderWord(): void {
    wordDisplayEl.innerHTML = "";
    for (const char of currentEntry.word) {
        const tile = document.createElement("span");
        tile.classList.add("letter-tile");
        tile.setAttribute(
            "aria-label",
            guessedLetters.has(char) ? char : "blank",
        );
        if (guessedLetters.has(char)) {
            tile.textContent = char.toUpperCase();
            tile.classList.add("revealed", "pop");
        }
        wordDisplayEl.appendChild(tile);
    }
}

function renderKeyboard(): void {
    keyboardEl.innerHTML = "";
    for (let code = 65; code <= 90; code++) {
        const letter = String.fromCharCode(code).toLowerCase();
        const btn = document.createElement("button");
        btn.classList.add("key-btn");
        btn.textContent = letter.toUpperCase();
        btn.dataset["letter"] = letter;
        btn.setAttribute("aria-label", `Guess letter ${letter.toUpperCase()}`);
        if (guessedLetters.has(letter)) {
            btn.classList.add(
                currentEntry.word.includes(letter) ? "correct" : "wrong",
            );
            btn.disabled = true;
        }
        btn.addEventListener("click", () => handleGuess(letter));
        keyboardEl.appendChild(btn);
    }
}

function renderLives(): void {
    livesPipsEl.innerHTML = "";
    for (let i = 0; i < MAX_WRONG; i++) {
        const pip = document.createElement("span");
        pip.classList.add("life-pip");
        if (i < wrongCount) pip.classList.add("lost");
        livesPipsEl.appendChild(pip);
    }
}

function updateWrongCount(): void {
    wrongCountEl.textContent = String(wrongCount);
}
function updateScoreDisplay(): void {
    scoreWinsEl.textContent = String(sessionWins);
    scoreLossesEl.textContent = String(sessionLosses);
}

/* ─────────────────────────────────────────
   GAME LOGIC
───────────────────────────────────────── */
function handleGuess(letter: string): void {
    if (gameStatus !== "playing" || guessedLetters.has(letter)) return;
    guessedLetters.add(letter);
    const btn = keyboardEl.querySelector<HTMLButtonElement>(
        `[data-letter="${letter}"]`,
    );

    if (currentEntry.word.includes(letter)) {
        btn?.classList.add("correct");
        if (btn) btn.disabled = true;
        renderWord();
        if (isWordComplete()) {
            gameStatus = "won";
            sessionWins++;
            updateScoreDisplay();
            saveScore(hm_currentUsername, sessionWins, hm_STORAGE_KEY);
            renderLeaderboard(hm_STORAGE_KEY, leaderboardListEl);
            setTimeout(() => showOverlay(true), 400);
        }
    } else {
        wrongCount++;
        btn?.classList.add("wrong");
        if (btn) btn.disabled = true;
        const partEl = document.getElementById(BODY_PARTS[wrongCount - 1]);
        if (partEl) {
            partEl.style.display = "";
            partEl.classList.add("pop");
        }
        const svg = document.getElementById("hangman-svg");
        if (svg) {
            svg.classList.remove("shake");
            void svg.offsetWidth;
            svg.classList.add("shake");
            svg.addEventListener(
                "animationend",
                () => svg.classList.remove("shake"),
                { once: true },
            );
        }
        updateWrongCount();
        renderLives();
        if (wrongCount >= MAX_WRONG) {
            gameStatus = "lost";
            sessionLosses++;
            updateScoreDisplay();
            saveScore(hm_currentUsername, sessionWins, hm_STORAGE_KEY);
            renderLeaderboard(hm_STORAGE_KEY, leaderboardListEl);
            guessedLetters = new Set(currentEntry.word.split(""));
            renderWord();
            setTimeout(() => showOverlay(false), 600);
        }
    }
}

function isWordComplete(): boolean {
    return [...new Set(currentEntry.word.split(""))].every((l) =>
        guessedLetters.has(l),
    );
}

function showOverlay(won: boolean): void {
    overlayEmojiEl.textContent = won ? "🎉" : "💀";
    overlayTitleEl.textContent = won ? "YOU WON!" : "GAME OVER";
    overlayTitleEl.style.color = won ? "var(--cyan)" : "#ff4d4d";
    overlayWordEl.textContent = `The word was: ${currentEntry.word.toUpperCase()}`;
    overlayEl.classList.add("active");
}

/* ─────────────────────────────────────────
   KEYBOARD + EVENTS
───────────────────────────────────────── */
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !hm_usernameScreen.classList.contains("hidden")) {
        hm_enterGame();
        return;
    }
    if (
        e.key.length === 1 &&
        /^[a-zA-Z]$/.test(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !overlayEl.classList.contains("active") &&
        !hm_gameScreen.classList.contains("hidden")
    ) {
        handleGuess(e.key.toLowerCase());
    }
});

hm_startBtn.addEventListener("click", hm_enterGame);
hm_changeUserBtn.addEventListener("click", exitToUsernameScreen);
playAgainBtn.addEventListener("click", hm_startGame);
hm_usernameInput.focus();
