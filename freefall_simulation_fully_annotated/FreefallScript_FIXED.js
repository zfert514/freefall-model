
/* Freefall Simulation with Canvas UI and Drag-to-Set Height
   ---------------------------------------------------------
   Fixes:
   - Moves all DOM and canvas references inside window.onload
   - Ensures ball stops at position <= 0
   - Displays drag and gravity on overlay
   - Initializes and updates canvases properly
*/

let intervalId = null;
let isPaused = false;
let isDragging = false;
let ballY = 150;
let height = 15;
const maxMeters = 30.48; // 100ft

let velocity = 0;
let position = 0;
let elapsed = 0;

// Declare DOM elements globally
let simCanvas, overlayCanvas, simCtx, overlayCtx;
let heightInput, gravityInput, gravitySelect, atmosphereSelect, elapsedTimeDisplay, velocityDisplay, forceDisplay, pauseBtn;

window.onload = () => {
    // Get canvas and UI elements
    simCanvas = document.getElementById("simulationCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");
    simCtx = simCanvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");

    // Set canvas size
    simCanvas.width = overlayCanvas.width = 300;
    simCanvas.height = overlayCanvas.height = 300;

    heightInput = document.getElementById("height");
    gravityInput = document.getElementById("gravity");
    gravitySelect = document.getElementById("gravityType");
    atmosphereSelect = document.getElementById("atmosphere");
    elapsedTimeDisplay = document.getElementById("elapsedTime");
    velocityDisplay = document.getElementById("velocity");
    forceDisplay = document.getElementById("force");
    pauseBtn = document.getElementById("pauseBtn");

    drawBall(ballY);
    updateHeightFromY();
    setupDragEvents();
};

/* === Utility Functions === */
function updateHeightFromY() {
    const metersPerPixel = maxMeters / simCanvas.height;
    height = (simCanvas.height - ballY) * metersPerPixel;
    height = Math.max(0, Math.min(height, maxMeters));
    heightInput.value = height.toFixed(2);
}

function drawBall(y) {
    simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);
    simCtx.beginPath();
    simCtx.arc(simCanvas.width / 2, y, 10, 0, Math.PI * 2);
    simCtx.fillStyle = "red";
    simCtx.fill();
}

function drawOverlay(elapsed, velocity, gravity, drag) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.font = "12px sans-serif";
    overlayCtx.fillStyle = "black";
    overlayCtx.fillText(`Elapsed: ${elapsed.toFixed(2)}s`, 10, 20);
    overlayCtx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 10, 40);
    overlayCtx.fillText(`Gravity: ${gravity.toFixed(2)} m/s²`, 10, 60);
    overlayCtx.fillText(`Drag: ${drag.toFixed(2)} m/s²`, 10, 80);
}

/* === Drag Events === */
function setupDragEvents() {
    simCanvas.addEventListener("mousedown", (e) => {
        const rect = simCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (Math.abs(x - simCanvas.width / 2) < 15 && Math.abs(y - ballY) < 15) {
            isDragging = true;
        }
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const rect = simCanvas.getBoundingClientRect();
        ballY = Math.max(0, Math.min(e.clientY - rect.top, simCanvas.height));
        drawBall(ballY);
        updateHeightFromY();
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

/* === Simulation Logic === */
function setGravity() {
    if (gravitySelect.value === "custom") {
        gravityInput.removeAttribute("disabled");
    } else {
        gravityInput.value = gravitySelect.value;
        gravityInput.setAttribute("disabled", "true");
    }
}

function pauseSimulation() {
    if (!isPaused) {
        clearInterval(intervalId);
        isPaused = true;
        pauseBtn.textContent = "Resume Simulation";
    } else {
        isPaused = false;
        pauseBtn.textContent = "Pause Simulation";
        startSimulation(true);
    }
}

function startSimulation(resume = false) {
    clearInterval(intervalId);

    const gravity = parseFloat(gravityInput.value);
    const dragCoefficient = (atmosphereSelect.value === "air") ? 0.1 : 0;
    const pixelsPerMeter = simCanvas.height / maxMeters;

    pauseBtn.disabled = false;
    pauseBtn.textContent = "Pause Simulation";

    if (!resume) {
        velocity = 0;
        position = height;
        elapsed = 0;
    }

    startTime = Date.now() - elapsed * 1000;

    intervalId = setInterval(() => {
        elapsed = (Date.now() - startTime) / 1000;
        const dragForce = dragCoefficient * velocity * velocity;
        const netAccel = gravity - dragForce;

        velocity += netAccel * 0.05;
        position -= velocity * 0.05;

        if (position <= 0) {
            position = 0;
            clearInterval(intervalId);
            pauseBtn.disabled = true;
        }

        const y = simCanvas.height - position * pixelsPerMeter;
        drawBall(Math.min(simCanvas.height - 10, y));
        drawOverlay(elapsed, velocity, gravity, dragForce);
    }, 50);
}

function restartSimulation() {
    clearInterval(intervalId);
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause Simulation";

    velocity = 0;
    position = 0;
    elapsed = 0;
    ballY = simCanvas.height / 2;

    drawBall(ballY);
    updateHeightFromY();
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}
