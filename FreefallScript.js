/*
Freefall Simulation with Canvas UI and Drag-to-Set Height
---------------------------------------------------------
This script creates a two-canvas interactive simulation:
- simulationCanvas: handles falling ball physics and animation.
- overlayCanvas: displays velocity, elapsed time, and forces.
- Users can drag the ball vertically before starting to simulate to set height.
- Height is capped at 100ft
*/

/* ============================
   GLOBAL VARIABLES & SETTINGS
   ============================ */
// Main interval ID for the simulation animation loop
let intervalId = null;
let startTime = null;
let isPaused = false;
// Flag to track whether the user is currently dragging the red ball
let isDragging = false;
let ballY = 150; // Initial Y center in canvas
let height = 15; // Default 15 meters (~50 ft)
const maxMeters = 30.48; // 100 ft in meters

let velocity = 0;
let position = 0;
let elapsed = 0;

// Initialize Canvases
let simCanvas, overlayCanvas, simCtx, overlayCtx;

// Grab Buttons and Inputs
const velocityInput = document.getElementById("velocity");
const heightInput = document.getElementById("height");
const gravityInput = document.getElementById("gravity");
const gravitySelect = document.getElementById("gravityType");
const atmosphereSelect = document.getElementById("atmosphere");
const elapsedTime = document.getElementById("elapsedTime");
const pauseBtn = document.getElementById("pauseBtn");
const force = document.getElementById("force");

/* ============================
   ON PAGE LOAD
   ============================ */
// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
window.onload = () => {
    // Get canvas from document and set as 2d
    simCanvas = document.getElementById("simulationCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");
    simCtx = simCanvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");
    
    initializeCanvas();
    drawBall(ballY);
    updateHeight();
};

/* ============================
   CANVAS INITIALIZATION
   ============================ */
// Sets up canvas dimensions and styling dynamically
function initializeCanvas() {
    // Set dimensions
    simCanvas.width = 300;
    simCanvas.height = 300;
    overlayCanvas.width = 300;
    overlayCanvas.height = 300;
}

/* ============================
   RENDERING FUNCTIONS
   ============================ */
// Draw the red ball at current Y
// Draws the red ball at a given Y position in the simulation canvas.
function drawBall(y) {
    simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height); // Erases canvas each frame for animation
    simCtx.beginPath();
    simCtx.arc(simCanvas.width / 2, y, 10, 0, Math.PI * 2); // Creates ball centrally
    simCtx.fillStyle = "red";
    simCtx.fill();
}

// Converts Y-coordinate to height and updates the input field
// Converts the Y position of the red ball in the canvas into a height (in meters) to 2 decimal points.
function updateHeight() {
    const metersPerPixel = maxMeters / simCanvas.height;
    height = (simCanvas.height - ballY) * metersPerPixel;
    height = Math.max(0, Math.min(height, maxMeters));
    heightInput.value = height.toFixed(2);
}

/* ============================
   COMPUTATIONS
   ============================ */
// Set gravity value from dropdown or allow custom
function setGravity() {
    if (gravitySelect.value === "custom") {
        gravityInput.removeAttribute("disabled");
    } else {
        gravityInput.value = gravitySelect.value;
        gravityInput.setAttribute("disabled", "true");
    }
}

// Draw data overlay
// Draws simulation data such as elapsed time, velocity, gravity, and drag on the overlay canvas.
function drawOverlay(elapsed, velocity, gravity, drag) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.font = "12px sans-serif";
    overlayCtx.fillStyle = "black";
    overlayCtx.fillText(`Elapsed: ${elapsed.toFixed(2)}s`, 10, 20);
    overlayCtx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 10, 40);
    overlayCtx.fillText(`Gravity: ${gravity.toFixed(2)} m/s²`, 10, 60);
    overlayCtx.fillText(`Drag: ${drag.toFixed(2)} m/s²`, 10, 80);
}

/* ============================
   DRAG FUNCTIONALITY
   ============================ */
// Allow dragging the ball
// Handles mouse down event to detect if the user starts dragging the red ball.
window.addEventListener("mousedown", (e) => {
    const rect = simCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.abs(x - simCanvas.width / 2) < 15 && Math.abs(y - ballY) < 15) {
        isDragging = true;
    }
});

// Handles mouse movement while dragging to reposition the red ball and update height.
window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const rect = simCanvas.getBoundingClientRect();
    ballY = Math.max(0, Math.min(e.clientY - rect.top, simCanvas.height));
    drawBall(ballY);
    updateHeight();
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

/* ============================
   SIMULATION CONTROL
   ============================ */
// Start simulation; if resume=true, use current velocity/position
// Starts or resumes the simulation depending on the 'resume' flag.
function startSimulation(resume = false) {
    clearInterval(intervalId);
    isPaused = false;

    const gravity = gravityInput.value;
    const atmosphere = atmosphereSelect.value;
    const dragCoefficient = atmosphere === "air" ? 0.1 : 0;
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

        // Update animation
        const y = simCanvas.height - position * pixelsPerMeter;
        drawBall(Math.min(simCanvas.height - 10, y));
        drawOverlay(elapsed, velocity, gravity, dragForce);

        if (position <= 0) {
            clearInterval(intervalId);
            drawOverlay(elapsed, 0, gravity, 0);
            playImpactSound();
            pauseBtn.disabled = true;
        }
    }, 50);
}

// Pause/resume toggle
// Toggles the simulation between paused and resumed states.
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

// Restart everything, reset ball to center
function restartSimulation() {
    clearInterval(intervalId);
    simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    ballY = simCanvas.height / 2;
    updateHeight();

    velocity.textContent = "Velocity: ";
    elapsedTime.textContent = "Elapsed Time: ";
    force.textContent = "Forces: ";
    pauseBtn.textContent = "Pause Simulation";
    pauseBtn.disabled = true;

    drawBall(ballY);
}

/* ============================
   EXTRA CONTROLS
   ============================ */
// Play sound if toggle is enabled
function playImpactSound() {
    if (!document.getElementById("soundToggle").checked) return;
    const audio = new Audio("https://www.soundjay.com/mechanical/sounds/metal-impact-1.mp3");
    audio.play();
}
