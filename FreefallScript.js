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

// Declare DOM elements globally
let simCanvas, overlayCanvas, simCtx, overlayCtx;
let heightInput,
    gravityInput,
    gravitySelect,
    atmosphereSelect,
    elapsedTimeDisplay,
    velocityDisplay,
    forceDisplay,
    pauseBtn;

/* ============================
   PAGE LOAD
   ============================ */
// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
window.onload = () => {
    // Get canvas
    simCanvas = document.getElementById("simulationCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");
    simCtx = simCanvas.getContext("2d");
    overlayCtx = overlayCanvas.getContext("2d");

    // Set canvas size
    simCanvas.width = overlayCanvas.width = 300;
    simCanvas.height = overlayCanvas.height = 300;

    // Get UI elements
    heightInput = document.getElementById("height");
    gravityInput = document.getElementById("gravity");
    gravitySelect = document.getElementById("gravityType");
    atmosphereSelect = document.getElementById("atmosphere");
    elapsedTimeDisplay = document.getElementById("elapsedTime");
    velocityDisplay = document.getElementById("velocity");
    forceDisplay = document.getElementById("force");
    pauseBtn = document.getElementById("pauseBtn");

    // Setup Canvas
    drawBall(ballY);
    updateHeight();
    setupDragEvents();
    drawOverlay(0, 0, 0, 0);
};

/* ============================
   UTILITY FUNCTIONS
   ============================ */
// Converts Y-coordinate to height and updates the input field
// Converts the Y position of the red ball in the canvas into a height (in meters) to 2 decimal points.
function updateHeight() {
    const metersPerPixel = maxMeters / simCanvas.height;
    height = (simCanvas.height - ballY) * metersPerPixel;
    height = Math.max(0, Math.min(height, maxMeters));
    heightInput.value = height.toFixed(2);
}

// Draw the red ball at current Y
// Draws the red ball at a given Y position in the simulation canvas.
function drawBall(y) {
    simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height); // Erases canvas each frame for animation
    simCtx.beginPath();
    simCtx.arc(simCanvas.width / 2, y, 10, 0, Math.PI * 2); // Creates ball centrally
    simCtx.fillStyle = "red";
    simCtx.fill();
}

// Draw data overlay
// Draws simulation data such as elapsed time, velocity, gravity, and drag on the overlay canvas.
function drawOverlay(elapsed, velocity, gravity, drag) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.font = "12px sans-serif";
    overlayCtx.fillStyle = "black";
    overlayCtx.fillText(`Elapsed: ${elapsed.toFixed(2)}s`, 10, 20);
    overlayCtx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 10, 40);
    overlayCtx.fillText(`Drag: ${drag.toFixed(2)} m/s²`, 10, 60);
    //overlayCtx.fillText(`Gravity: ${gravity.toFixed(2)} m/s²`, 10, 80);
}

/* ============================
   DRAG FUNCTIONALITY
   ============================ */
// Allow dragging the ball
// Handles mouse down event to detect if the user starts dragging the red ball.
function setupDragEvents() {
    simCanvas.addEventListener("mousedown", (e) => {
        const rect = simCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (Math.abs(x - simCanvas.width / 2) < 15 && Math.abs(y - ballY) < 15) {
            isDragging = true;
        }
    });

    // Handles mouse movement while dragging to reposition the red ball and update height.
    simCanvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const rect = simCanvas.getBoundingClientRect();
        ballY = Math.max(0, Math.min(e.clientY - rect.top, simCanvas.height));
        drawBall(ballY);
        updateHeight();
    });

    simCanvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Moves ball when height input is changed
    heightInput.addEventListener("input", () => {
        // Get new height value
        const newHeight = parseFloat(document.getElementById("height").value);

        // Convert to canvas Y position
        const maxMeters = 30.48;
        const pixelsPerMeter = canvas.height / maxMeters;
        ballY = simCanvas.height - newHeight * pixelsPerMeter;

        drawBall(ballY); // Update ball position
        updateHeight(); // Recalculate height from Y if needed
    });
}

/* ============================
   SIMULATION LOGIC
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

// Start simulation; if resume=true, use current velocity/position
// Starts or resumes the simulation depending on the 'resume' flag.
function startSimulation(resume = false) {
    clearInterval(intervalId);
    isPaused = false;

    heightInput.disabled = true;
    gravityInput.disabled = true;
    gravitySelect.disabled = true;
    atmosphereSelect.disabled = true;

    const gravity = parseFloat(gravityInput.value);
    const dragCoefficient = atmosphereSelect.value === "air" ? 0.1 : 0;
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
        if (position <= 0) {
            position = 0;
            clearInterval(intervalId);
            playImpactSound();
            pauseBtn.disabled = true;
        }

        const y = simCanvas.height - position * pixelsPerMeter;
        drawBall(Math.min(simCanvas.height - 10, y));
        drawOverlay(elapsed, velocity, gravity, dragForce);
    }, 50);
}

// Pause/resume toggle
// Toggles the simulation between paused and resumed states.
function pauseSimulation() {
    if (!isPaused) {
        clearInterval(intervalId);
        isPaused = !isPaused;
        pauseBtn.textContent = "Resume Simulation";
    } else {
        pauseBtn.textContent = "Pause Simulation";
        isPaused = !isPaused;
        startSimulation(true);
    }
}

// Restart everything, reset ball to center
function restartSimulation() {
    clearInterval(intervalId);
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause Simulation";

    heightInput.disabled = false;
    gravityInput.disabled = false;
    gravitySelect.disabled = false;
    atmosphereSelect.disabled = false;

    velocity = 0;
    position = 0;
    elapsed = 0;
    ballY = simCanvas.height / 2;

    drawBall(ballY);
    updateHeight();
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    drawOverlay(0, 0, 0, 0);
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
