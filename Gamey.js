// game.js

// ─── Shared Simulation Constants (from simulation.js) ────────────────────────────
const CANVAS_SIZE = window.canvasSize || 300; // px
const BALL_SIZE = window.ballSize || 10; // px
const MAX_METERS = window.maxMeters || 30.48; // m
const GRAVITY = 9.8; // m/s²
const METER_TO_PX = CANVAS_SIZE / MAX_METERS; // px per meter

// ─── DOM References (populated in initGame) ─────────────────────────────────────
let gameCanvas, gameCtx;
let dropButtons;

// ─── Image Objects ───────────────────────────────────────────────────────────────
const newtonImg = new Image();
const appleImg = new Image();

// ─── State ───────────────────────────────────────────────────────────────────────
let activeButton = null; // tracks which choice is currently “down” (disabled)

// ─── Initialization ──────────────────────────────────────────────────────────────
function initGame() {
    // 1) Canvas setup
    gameCanvas = document.getElementById("gameCanvas");
    gameCtx = gameCanvas.getContext("2d");
    gameCanvas.width = CANVAS_SIZE;
    gameCanvas.height = CANVAS_SIZE;

    // 2) Load Newton & AppleThin sources
    newtonImg.src = document.getElementById("isaacNewton").src;
    appleImg.src = window.appleImage?.src || "img/svg/apple_thin.svg";

    // 3) Once both base images are ready, draw them
    Promise.all([new Promise((r) => (newtonImg.onload = r)), new Promise((r) => (appleImg.onload = r))]).then(
        drawStatic
    );

    // 4) Wire up the drop-item buttons
    dropButtons = Array.from(document.querySelectorAll("#dropItemSelect button"));
    dropButtons.forEach((btn) => {
        btn.addEventListener("click", onDropButtonClick);
    });
}

// ─── Draw the “static” scene: Newton at left + AppleThin at right top ────────────
function drawStatic() {
    gameCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const applePx = BALL_SIZE * 2; // size in px
    const newtonPx = applePx * 3; // Newton is 3× apple
    const y0 = 10; // margin from top

    // Newton position (20% in)
    const newtonX = CANVAS_SIZE * 0.2 - newtonPx / 2;
    // AppleThin position (45% in)
    const appleX = CANVAS_SIZE * 0.45 - applePx / 2;

    gameCtx.drawImage(newtonImg, newtonX, y0, newtonPx, newtonPx);
    gameCtx.drawImage(appleImg, appleX, y0, applePx, applePx);
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
        drawStatic();
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
    const pickPx = BALL_SIZE * 2;
    const y0 = 10;
    const pickX = CANVAS_SIZE * 0.6 - pickPx / 2;
    gameCtx.drawImage(img, pickX, y0, pickPx, pickPx);
}

// ─── Animate two images falling side-by-side under s = ½ g t² ─────────────────────
function animateDrop(pickImg) {
    const startTime = performance.now();
    const applePx = BALL_SIZE * 2;
    const xApple = CANVAS_SIZE * 0.45 - applePx / 2;
    const xPick = CANVAS_SIZE * 0.6 - applePx / 2;
    const groundY = CANVAS_SIZE - applePx - 10; // 10px margin

    function frame(now) {
        const t = (now - startTime) / 1000; // sec
        const s = 0.5 * GRAVITY * t * t; // meters fallen
        const dy = Math.min(s * METER_TO_PX, groundY - 10);
        const y = 10 + dy;

        // 1) redraw the fixed scene
        drawStatic();

        // 2) draw both falling objects
        gameCtx.drawImage(appleImg, xApple, y, applePx, applePx);
        gameCtx.drawImage(pickImg, xPick, y, applePx, applePx);

        // 3) keep going until they hit “groundY”
        if (y < groundY) {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}

// ─── Kick everything off when the page loads ─────────────────────────────────────
window.addEventListener("load", initGame);
