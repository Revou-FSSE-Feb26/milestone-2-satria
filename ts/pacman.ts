/* ============================================================
   pacman.ts
   export {} at top = ES module → no global scope clash
   with hangman.ts when compiled from the same tsconfig.
   ============================================================ */

declare function saveScore(name: string, score: number, key: string): void;
declare function renderLeaderboard(key: string, el: HTMLElement): void;

const pm_STORAGE_KEY = "pacman_leaderboard";

/* ═══════════════════════════════════════ TYPES ══ */
type Direction = "LEFT" | "RIGHT" | "UP" | "DOWN" | "NONE";
type GhostMode = "CHASE" | "SCATTER" | "FRIGHTENED";
type GhostName = "blinky" | "pinky" | "inky" | "clyde";
interface Vec2 {
    x: number;
    y: number;
}

/* ═══════════════════════════════════════ MAZE ══
   0=path 1=wall 2=dot 3=energizer 4=ghost-house */
const MAZE_TEMPLATE: number[][] = [
    [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 3, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2,
        2, 2, 2, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 4, 4, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 2, 0, 0,
        0, 0, 0, 0,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1,
        1, 1, 1, 1,
    ],
    [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 3, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 1, 1,
        2, 2, 3, 1,
    ],
    [
        1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        2, 1, 1, 1,
    ],
    [
        1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        2, 1, 1, 1,
    ],
    [
        1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2,
        2, 2, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 1,
    ],
    [
        1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 1,
    ],
    [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1,
    ],
];

const COLS = 28;
const ROWS = 30;
const CELL = 20;
const W = COLS * CELL;
const H = ROWS * CELL;

const C = {
    wall: "#1a3a6b",
    wallStroke: "#00e5ff",
    dot: "rgba(255,255,255,.7)",
    energizer: "#f4d35e",
    pacman: "#f4d35e",
    frightened: "#3030ff",
    ghost: {
        blinky: "#ff4444",
        pinky: "#ffb8ff",
        inky: "#00e5ff",
        clyde: "#ffb847",
    } as Record<GhostName, string>,
};

/* ═══════════════════════════════════════ STATE ══ */
let maze: number[][];
let totalDots: number;
let dotsEaten: number;
let score: number;
let lives: number;
let level: number;
let gameRunning: boolean;
let frightTimer: number;
let pm_currentUsername = "";

let pac: {
    x: number;
    y: number;
    dir: Direction;
    nextDir: Direction;
    mouthAngle: number;
    mouthDir: number;
};

interface Ghost {
    name: GhostName;
    x: number;
    y: number;
    dir: Direction;
    mode: GhostMode;
    homeX: number;
    homeY: number;
    dead: boolean;
    deadTimer: number;
}
let ghosts: Ghost[];

let animId: number;
let lastTime: number;
let frameAcc: number;
const FRAME_MS = 1000 / 60;

/* ═══════════════════════════════════════ DOM ══ */
const pm_usernameScreen = document.getElementById(
    "username-screen",
) as HTMLElement;
const pm_gameScreen = document.getElementById("game-screen") as HTMLElement;
const pm_usernameInput = document.getElementById(
    "username-input",
) as HTMLInputElement;
const pm_startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const pm_changeUserBtn = document.getElementById(
    "change-user-btn",
) as HTMLButtonElement;
const pm_welcomeText = document.getElementById(
    "welcome-text",
) as HTMLParagraphElement;
const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = W;
canvas.height = H;
const overlay = document.getElementById("overlay") as HTMLDivElement;
const overlayEmoji = document.getElementById("overlay-emoji") as HTMLElement;
const overlayTitle = document.getElementById("overlay-title") as HTMLElement;
const overlaySub = document.getElementById("overlay-sub") as HTMLElement;
const overlayBtn = document.getElementById("overlay-btn") as HTMLButtonElement;
const scoreEl = document.getElementById("hud-score") as HTMLElement;
const levelEl = document.getElementById("hud-level") as HTMLElement;
const livesEl = document.getElementById("hud-lives") as HTMLElement;
const pm_leaderboardEl = document.getElementById(
    "leaderboard-list",
) as HTMLElement;

/* ═══════════════════════════════════════ HELPERS ══ */
function toTile(px: number): number {
    return Math.floor(px / CELL);
}
function tileCentre(t: number): number {
    return t * CELL + CELL / 2;
}
function walkable(col: number, row: number, forGhost = false): boolean {
    if (row < 0 || row >= ROWS) return false;
    const c = ((col % COLS) + COLS) % COLS;
    const cell = maze[row][c];
    if (cell === 1) return false;
    if (!forGhost && cell === 4) return false;
    return true;
}
function dist(ax: number, ay: number, bx: number, by: number): number {
    return Math.abs(ax - bx) + Math.abs(ay - by);
}
function dirDelta(d: Direction): Vec2 {
    switch (d) {
        case "LEFT":
            return { x: -1, y: 0 };
        case "RIGHT":
            return { x: 1, y: 0 };
        case "UP":
            return { x: 0, y: -1 };
        case "DOWN":
            return { x: 0, y: 1 };
        default:
            return { x: 0, y: 0 };
    }
}
function opposite(d: Direction): Direction {
    switch (d) {
        case "LEFT":
            return "RIGHT";
        case "RIGHT":
            return "LEFT";
        case "UP":
            return "DOWN";
        case "DOWN":
            return "UP";
        default:
            return "NONE";
    }
}
const SPEED_PAC = 1.5;
const SPEED_GHOST = 1.2;
const SPEED_FRIGHT = 0.8;

/* ═══════════════════════════════════════ INIT ══ */
function initMaze(): void {
    maze = MAZE_TEMPLATE.map((r) => [...r]);
    totalDots = 0;
    dotsEaten = 0;
    maze.forEach((r) =>
        r.forEach((c) => {
            if (c === 2 || c === 3) totalDots++;
        }),
    );
}
function initPac(): void {
    pac = {
        x: tileCentre(13),
        y: tileCentre(22),  // row 17 col 14 = 0 (open)
        dir: "NONE",
        nextDir: "NONE",
        mouthAngle: 0.25,
        mouthDir: -1,
    };
}
function initGhosts(): void {
    ghosts = [
        {
            name: "blinky",
            x: tileCentre(14),
            y: tileCentre(11),
            dir: "LEFT",
            mode: "SCATTER",
            homeX: 25,
            homeY: 0,
            dead: false,
            deadTimer: 0,
        },
        {
            name: "pinky",
            x: tileCentre(13),
            y: tileCentre(14),
            dir: "UP",
            mode: "SCATTER",
            homeX: 2,
            homeY: 0,
            dead: false,
            deadTimer: 0,
        },
        {
            name: "inky",
            x: tileCentre(14),
            y: tileCentre(14),
            dir: "LEFT",
            mode: "SCATTER",
            homeX: 27,
            homeY: 29,
            dead: false,
            deadTimer: 0,
        },
        {
            name: "clyde",
            x: tileCentre(15),
            y: tileCentre(14),
            dir: "UP",
            mode: "SCATTER",
            homeX: 0,
            homeY: 29,
            dead: false,
            deadTimer: 0,
        },
    ];
}
function pm_startGame(): void {
    initMaze();
    initPac();
    initGhosts();
    score = 0;
    lives = 3;
    level = 1;
    gameRunning = true;
    frightTimer = 0;
    showOverlayPanel(false);
    updateHUD();
    if (animId) cancelAnimationFrame(animId);
    lastTime = performance.now();
    frameAcc = 0;
    animId = requestAnimationFrame(loop);
}
function nextLevel(): void {
    level++;
    initMaze();
    initPac();
    initGhosts();
    frightTimer = 0;
    gameRunning = true;
    showOverlayPanel(false);
    updateHUD();
    // ✅ Must restart the loop or game freezes on level 2+
    if (animId) cancelAnimationFrame(animId);
    lastTime = performance.now();
    frameAcc = 0;
    animId = requestAnimationFrame(loop);
}
function loseLife(): void {
    lives--;
    updateHUD();
    if (lives <= 0) {
        gameOver();
    } else {
        initPac();
        initGhosts();
        frightTimer = 0;
        gameRunning = true;
    }
}
function gameOver(): void {
    gameRunning = false;
    saveScore(pm_currentUsername, score, pm_STORAGE_KEY);
    renderLeaderboard(pm_STORAGE_KEY, pm_leaderboardEl);
    showOverlayPanel(true, false);
}
function winLevel(): void {
    gameRunning = false;
    showOverlayPanel(true, true);
}

/* ═══════════════════════════════════════ LOOP ══ */
function loop(now: number): void {
    const dt = now - lastTime;
    lastTime = now;
    frameAcc += dt;
    draw();
    while (frameAcc >= FRAME_MS) {
        if (gameRunning) tick();
        frameAcc -= FRAME_MS;
    }
    animId = requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════ TICK ══ */
function tick(): void {
    movePac();
    checkDots();
    moveGhosts();
    checkCollisions();
    animateMouth();
    if (frightTimer > 0) frightTimer--;
}

function movePac(): void {
    const col = toTile(pac.x);
    const row = toTile(pac.y);
    const cx = tileCentre(col);
    const cy = tileCentre(row);
    const snapDist = SPEED_PAC + 1;
    const nearCX = Math.abs(pac.x - cx) <= snapDist;
    const nearCY = Math.abs(pac.y - cy) <= snapDist;
    if (pac.nextDir !== "NONE" && pac.nextDir !== pac.dir) {
        const nd = dirDelta(pac.nextDir);
        if (
            (nd.x !== 0 && nearCY && walkable(col + nd.x, row)) ||
            (nd.y !== 0 && nearCX && walkable(col, row + nd.y))
        ) {
            pac.dir = pac.nextDir;
            pac.nextDir = "NONE";
            if (dirDelta(pac.dir).x !== 0) pac.y = cy;
            if (dirDelta(pac.dir).y !== 0) pac.x = cx;
        }
    }
    if (pac.dir !== "NONE") {
        const d = dirDelta(pac.dir);
        const nx = pac.x + d.x * SPEED_PAC;
        const ny = pac.y + d.y * SPEED_PAC;
        const nc = toTile(d.x !== 0 ? nx + d.x * (CELL / 2 - 2) : nx);
        const nr = toTile(d.y !== 0 ? ny + d.y * (CELL / 2 - 2) : ny);
        const wrappedNx = ((nx % W) + W) % W;
        if (walkable(nc, nr)) {
            pac.x = wrappedNx;
            pac.y = ny;
        } else {
            if (d.x !== 0) pac.x = cx;
            if (d.y !== 0) pac.y = cy;
        }
    }
}
function animateMouth(): void {
    pac.mouthAngle += pac.mouthDir * 0.01;  // was 0.05
    if (pac.mouthAngle >= 0.25) {
        pac.mouthAngle = 0.25;
        pac.mouthDir = -1;
    }
    if (pac.mouthAngle <= 0.01) {
        pac.mouthAngle = 0.01;
        pac.mouthDir = 1;
    }
}
function checkDots(): void {
    const col = toTile(pac.x);
    const row = toTile(pac.y);
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
    const cell = maze[row][col];
    if (cell === 2) {
        maze[row][col] = 0;
        score += 10;
        dotsEaten++;
        updateHUD();
    } else if (cell === 3) {
        maze[row][col] = 0;
        score += 50;
        dotsEaten++;
        frightTimer = 150;
        ghosts.forEach((g) => {
            if (!g.dead) g.mode = "FRIGHTENED";
        });
        updateHUD();
    }
    if (dotsEaten >= totalDots) winLevel();
}
function moveGhosts(): void {
    ghosts.forEach((g) => {
        if (g.dead) {
            g.deadTimer--;
            if (g.deadTimer <= 0) {
                g.dead = false;
                g.x = tileCentre(14);
                g.y = tileCentre(11);
                g.dir = "LEFT";
                g.mode = frightTimer > 0 ? "FRIGHTENED" : "SCATTER";
            }
            return;
        }
        if (frightTimer === 0 && g.mode === "FRIGHTENED") g.mode = "SCATTER";
        const speed = g.mode === "FRIGHTENED" ? SPEED_FRIGHT : SPEED_GHOST;
        const col = toTile(g.x);
        const row = toTile(g.y);
        const cx = tileCentre(col);
        const cy = tileCentre(row);

        // ✅ Larger snap threshold so ghosts reliably hit decision points
        if (Math.abs(g.x - cx) <= 1 && Math.abs(g.y - cy) <= 1) {
            g.x = cx;
            g.y = cy;
            const target = getGhostTarget(g);
            const dirs: Direction[] = ["LEFT", "RIGHT", "UP", "DOWN"];
            const valid = dirs.filter((d) => {
                if (d === opposite(g.dir)) return false;
                const dd = dirDelta(d);
                return walkable(col + dd.x, row + dd.y, true);
            });
            if (valid.length === 0) {
                g.dir = opposite(g.dir);
            } else if (g.mode === "FRIGHTENED") {
                g.dir = valid[Math.floor(Math.random() * valid.length)];
            } else {
                g.dir = valid.reduce((best, d) => {
                    const dd = dirDelta(d);
                    const dx = dist(col + dd.x, row + dd.y, target.x, target.y);
                    const db = dirDelta(best);
                    const dbx = dist(col + db.x, row + db.y, target.x, target.y);
                    return dx < dbx ? d : best;
                });
            }
        }
        const dd = dirDelta(g.dir);
        g.x += dd.x * speed;
        g.y += dd.y * speed;
        g.x = ((g.x % W) + W) % W;
    });
}
function getGhostTarget(g: Ghost): Vec2 {
    // If inside ghost house area, target the exit
    const col = toTile(g.x);
    const row = toTile(g.y);
    if (row >= 12 && row <= 15 && col >= 9 && col <= 18) {
        return { x: 14, y: 11 }; // exit tile above house
    }
    const pacCol = toTile(pac.x);
    const pacRow = toTile(pac.y);
    if (g.mode === "SCATTER") return { x: g.homeX, y: g.homeY };
    switch (g.name) {
        case "blinky":
            return { x: pacCol, y: pacRow };
        case "pinky": {
            const d = dirDelta(pac.dir);
            return { x: pacCol + d.x * 4, y: pacRow + d.y * 4 };
        }
        case "inky": {
            const blinky = ghosts.find((g2) => g2.name === "blinky")!;
            const d2 = dirDelta(pac.dir);
            const px = pacCol + d2.x * 2;
            const py = pacRow + d2.y * 2;
            return {
                x: px + (px - toTile(blinky.x)),
                y: py + (py - toTile(blinky.y)),
            };
        }
        case "clyde": {
            const d3 = dist(toTile(g.x), toTile(g.y), pacCol, pacRow);
            return d3 > 8
                ? { x: pacCol, y: pacRow }
                : { x: g.homeX, y: g.homeY };
        }
        default:
            return { x: pacCol, y: pacRow };
    }
}
function checkCollisions(): void {
    ghosts.forEach((g) => {
        if (g.dead) return;
        if (
            Math.abs(g.x - pac.x) < CELL * 0.7 &&
            Math.abs(g.y - pac.y) < CELL * 0.7
        ) {
            if (g.mode === "FRIGHTENED") {
                g.dead = true;
                g.deadTimer = 80;
                score += 200;
                updateHUD();
            } else {
                gameRunning = false;
                setTimeout(loseLife, 800);
            }
        }
    });
}

/* ═══════════════════════════════════════ DRAW ══ */
function draw(): void {
    ctx.clearRect(0, 0, W, H);
    drawMaze();
    drawDots();
    drawGhosts();
    drawPac();
}
function drawMaze(): void {
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (maze[r][c] === 1) {
                ctx.fillStyle = C.wall;
                ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
                ctx.strokeStyle = C.wallStroke;
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    c * CELL + 0.5,
                    r * CELL + 0.5,
                    CELL - 1,
                    CELL - 1,
                );
            }
}
function drawDots(): void {
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
            const cell = maze[r][c];
            const cx = c * CELL + CELL / 2;
            const cy = r * CELL + CELL / 2;
            if (cell === 2) {
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, Math.PI * 2);
                ctx.fillStyle = C.dot;
                ctx.fill();
            } else if (cell === 3) {
                const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);
                ctx.beginPath();
                ctx.arc(cx, cy, 5 + pulse * 2, 0, Math.PI * 2);
                ctx.fillStyle = C.energizer;
                ctx.shadowBlur = 12;
                ctx.shadowColor = C.energizer;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
}
function drawPac(): void {
    const d = dirDelta(pac.dir === "NONE" ? "RIGHT" : pac.dir);
    const angle = Math.atan2(d.y, d.x);
    const mouth = pac.mouthAngle * Math.PI;
    ctx.beginPath();
    ctx.moveTo(pac.x, pac.y);
    ctx.arc(
        pac.x,
        pac.y,
        CELL / 2 - 1,
        angle + mouth,
        angle + Math.PI * 2 - mouth,
    );
    ctx.closePath();
    ctx.fillStyle = C.pacman;
    ctx.shadowBlur = 15;
    ctx.shadowColor = C.pacman;
    ctx.fill();
    ctx.shadowBlur = 0;
}
function drawGhosts(): void {
    ghosts.forEach((g) => {
        if (g.dead) return;
        const r = CELL / 2 - 1;
        let color: string;
        if (g.mode === "FRIGHTENED")
            color =
                frightTimer < 40 && Math.floor(frightTimer / 8) % 2 === 0
                    ? "#ffffff"
                    : C.frightened;
        else color = C.ghost[g.name];
        ctx.fillStyle = color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(g.x, g.y - 1, r, Math.PI, 0);
        ctx.lineTo(g.x + r, g.y + r);
        const segW = (r * 2) / 3;
        for (let i = 0; i < 3; i++) {
            const wx = g.x + r - (i + 1) * segW;
            const wh = i % 2 === 0 ? g.y + r - 4 : g.y + r;
            ctx.lineTo(wx, wh);
        }
        ctx.lineTo(g.x - r, g.y + r);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        if (g.mode !== "FRIGHTENED") {
            [-4, 4].forEach((ox) => {
                ctx.beginPath();
                ctx.arc(g.x + ox, g.y - 3, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
                const px = toTile(pac.x) - toTile(g.x);
                const py = toTile(pac.y) - toTile(g.y);
                const mag = Math.sqrt(px * px + py * py) || 1;
                ctx.beginPath();
                ctx.arc(
                    g.x + ox + (px / mag) * 1.5,
                    g.y - 3 + (py / mag) * 1.5,
                    2,
                    0,
                    Math.PI * 2,
                );
                ctx.fillStyle = "#00e5ff";
                ctx.fill();
            });
        } else {
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.5;
            [-4, 4].forEach((ox) => {
                ctx.beginPath();
                ctx.moveTo(g.x + ox - 2, g.y - 5);
                ctx.lineTo(g.x + ox + 2, g.y - 1);
                ctx.moveTo(g.x + ox + 2, g.y - 5);
                ctx.lineTo(g.x + ox - 2, g.y - 1);
                ctx.stroke();
            });
        }
    });
}

/* ═══════════════════════════════════════ HUD ══ */
function updateHUD(): void {
    scoreEl.textContent = String(score);
    levelEl.textContent = String(level);
    livesEl.innerHTML = "";
    for (let i = 0; i < lives; i++) {
        const ic = document.createElement("span");
        ic.className = "life-icon";
        ic.textContent = "🟡";
        livesEl.appendChild(ic);
    }
}

/* ═══════════════════════════════════════ OVERLAY ══ */
function showOverlayPanel(show: boolean, won?: boolean): void {
    if (!show) {
        overlay.classList.add("hidden");
        return;
    }
    overlay.classList.remove("hidden");
    if (won) {
        overlayEmoji.textContent = "🎉";
        overlayTitle.textContent = "LEVEL CLEAR!";
        overlayTitle.style.color = "#f4d35e";
        overlaySub.textContent = `Score: ${score}`;
        overlayBtn.textContent = "NEXT LEVEL";
        overlayBtn.onclick = nextLevel;
    } else {
        overlayEmoji.textContent = "💀";
        overlayTitle.textContent = "GAME OVER";
        overlayTitle.style.color = "#00e5ff";
        overlaySub.textContent = `Final Score: ${score}`;
        overlayBtn.textContent = "PLAY AGAIN";
        overlayBtn.onclick = pm_startGame;
    }
}

/* ═══════════════════════════════════════ USERNAME ══ */
function pm_enterGame(): void {
    const name = pm_usernameInput.value.trim();
    if (!name) {
        pm_usernameInput.classList.add("error");
        pm_usernameInput.focus();
        return;
    }
    pm_usernameInput.classList.remove("error");
    pm_currentUsername = name;
    pm_usernameScreen.classList.add("hidden");
    pm_gameScreen.style.display = "flex";
    pm_gameScreen.classList.remove("hidden");
    pm_welcomeText.textContent = `// playing as: ${pm_currentUsername} //`;
    renderLeaderboard(pm_STORAGE_KEY, pm_leaderboardEl);

    initMaze();
    initPac();
    initGhosts();
    score = 0;
    lives = 3;
    level = 1;
    frightTimer = 0;
    updateHUD();

    // Show overlay FIRST, then draw the preview frame behind it
    overlayEmoji.textContent = "👾";
    overlayTitle.textContent = "PAC-MAN";
    overlayTitle.style.color = "#00e5ff";
    overlaySub.textContent = "eat all the dots!";
    overlayBtn.textContent = "START GAME";
    overlayBtn.onclick = pm_startGame;
    overlay.classList.remove("hidden");

    draw(); // preview frame renders behind the overlay
}
function exitToUsername(): void {
    gameRunning = false;
    cancelAnimationFrame(animId);
    pm_gameScreen.style.display = "";
    pm_gameScreen.classList.add("hidden");
    pm_usernameScreen.classList.remove("hidden");
    pm_usernameInput.value = "";
}

/* ═══════════════════════════════════════ INPUT ══ */
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !pm_usernameScreen.classList.contains("hidden")) {
        pm_enterGame();
        return;
    }

    // Don't intercept keys while typing a username
    if (!pm_usernameScreen.classList.contains("hidden")) return;

    const map: Record<string, Direction> = {
        ArrowLeft: "LEFT",
        a: "LEFT",
        A: "LEFT",
        ArrowRight: "RIGHT",
        d: "RIGHT",
        D: "RIGHT",
        ArrowUp: "UP",
        w: "UP",
        W: "UP",
        ArrowDown: "DOWN",
        s: "DOWN",
        S: "DOWN",
    };

    if (map[e.key]) {
        e.preventDefault();
        pac.nextDir = map[e.key];
    }
});

function bindCtrl(id: string, dir: Direction): void {
    const btn = document.getElementById(id);
    if (!btn) return;
    const set = () => {
        pac.nextDir = dir;
    };
    btn.addEventListener("touchstart", set, { passive: true });
    btn.addEventListener("mousedown", set);
}
bindCtrl("ctrl-left", "LEFT");
bindCtrl("ctrl-right", "RIGHT");
bindCtrl("ctrl-up", "UP");
bindCtrl("ctrl-down", "DOWN");

/* ═══════════════════════════════════════ BOOT ══ */
pm_startBtn.addEventListener("click", pm_enterGame);
pm_changeUserBtn.addEventListener("click", exitToUsername);
pm_usernameInput.focus();
