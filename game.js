// game.js
// Controls the “gameCanvas”: shows Newton + AppleThin, spawns your picked item,
// and drops both Apple & the picked item side-by-side.
/*
This is the Game Control document for the Freefall Simulation.
It includes:
- Functionality for configuring simulation settings (gravity, atmosphere, etc.)
- Functionality for start, pause, and restart the simulation
- Functionality for canvas to render the falling object animation
- Functionality for overlay canvas for overlaying live data like velocity and force
- (NEEDS WORK) Functionality for drag in air environment
- Fuctionality for changing unit from m to ft
- Functionality for dragging the red ball up and down to set initial height
- Maximum height set to 100ft (~30.48 meters)
*/

/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */

// --- grab the shared globals from simulation.js ---
const gameCanvasSize = window.gameCanvasSize || 300; // px
const meterToPx = gameCanvasSize / maxMeters; // px per meter

// ─── DOM References (populated in initGame) ─────────────────────────────────────
let gameCanvas, gameCtx;
let dropButtons;

//  ─── Load gameApple source ─────────────────────────────────────────────────────
const gameApple = new Image();
gameApple.src = "img/svg/apple_thin.svg";

// ─── State ───────────────────────────────────────────────────────────────────────
let activeButton = null; // tracks which choice is currently “down” (disabled)

// ─── Initialization ──────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
    // 1) Canvas setup
    gameCanvas = document.getElementById("gameCanvas");
    gameCtx = gameCanvas.getContext("2d");
    gameCanvas.width = gameCanvas.height = gameCanvasSize;

    // 2) Once both base images are ready, draw them
    Promise.all([new Promise((r) => (gameApple.onload = r))]).then(drawStatic);

    // 3) Wire up the drop-item buttons
    dropButtons = Array.from(document.querySelectorAll("#dropItemSelect button"));
    dropButtons.forEach((btn) => {
        btn.addEventListener("click", onDropButtonClick);
    });
}

// ─── Draw the “static” scene: Newton at left + AppleThin at right top ────────────
function drawStatic() {
    gameCtx.clearRect(0, 0, gameCanvasSize, gameCanvasSize);

    // size them relative to ballSize
    const aSize = ballSize * 2;

    // positions
    const y0 = 10; // 10px from top
    const appleX = gameCanvasSize * 0.45 - aSize / 2;

    gameCtx.drawImage(gameApple, appleX, y0, aSize, aSize);
}

// ─── Click Handler: pick your item, disable its button, re-enable the old one ────
function onDropButtonClick(evt) {
    const btn = evt.currentTarget;

    // 1) update which button is active (disable new, enable old)
    setActiveButton(btn);

    // 2) load the chosen SVG
    const pickImg = new Image();
    pickImg.src = btn.querySelector("img").src;

    // 3) once it’s ready, redraw static + show the pick + animate both drops
    pickImg.onload = () => {
        //drawStatic();
        drawPickAtTop(pickImg);
        animateDrop(pickImg);
    };
}

// ─── Disable the new button, re-enable the previous one, grey-out visually ───────
function setActiveButton(newBtn) {
    if (activeButton) {
        // re-enable old
        activeButton.disabled = false;
        activeButton.style.opacity = 1;
    }

    // disable the new one
    newBtn.disabled = true;
    newBtn.style.opacity = 0.5;

    // track it
    activeButton = newBtn;
}

// ─── Draw the freshly picked item next to the apple at top ────────────────────────
function drawPickAtTop(img) {
    const pickPx = ballSize * 2;
    const y0 = 10;
    const pickX = gameCanvasSize * 0.6 - pickPx / 2;
    gameCtx.drawImage(img, pickX, y0, pickPx, pickPx);
}

// ─── Animate two images falling side-by-side under s = ½ g t² ─────────────────────
function animateDrop(pickImg) {
    const startTime = performance.now();
    const applePx = ballSize * 2;
    const xApple = gameCanvasSize * 0.45 - applePx / 2;
    const xPick = gameCanvasSize * 0.6 - applePx / 2;
    const groundY = gameCanvasSize - applePx - 10; // 10px margin

    function frame(now) {
        const t = (now - startTime) / 1000; // sec
        const s = 0.5 * gravity * t * t; // meters fallen
        const dy = Math.min(s * meterToPx, groundY - 10);
        const y = 10 + dy;

        // 1) Clear the canvas
        gameCtx.clearRect(0, 0, gameCanvasSize, gameCanvasSize);

        // 2) draw both falling objects
        gameCtx.drawImage(gameApple, xApple, y, applePx, applePx);
        gameCtx.drawImage(pickImg, xPick, y, applePx, applePx);

        // 3) keep going until they hit “groundY”
        if (y < groundY) {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}
