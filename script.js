/* 
Freefall Simulation with Canvas UI and Drag-to-Set Height
---------------------------------------------------------
This script creates a two-canvas interactive simulation:
- simulationCanvas: handles falling ball physics and animation.
- overlayCanvas: displays velocity, elapsed time, and forces.
- Users can drag the ball vertically before starting to simulate to set height.
*/

// Main interval ID for the simulation animation loop
let intervalId = null;
let startTime = null;
let isPaused = false;
// Flag to track whether the user is currently dragging the red ball
let isDragging = false;
let ballY = 150;  // Initial Y center in canvas
let height = 15;  // Default 15 meters (~50 ft)
const maxMeters = 30.48; // 100 ft in meters

let velocity = 0;
let position = 0;
let elapsed = 0;

// Set gravity value from dropdown or allow custom
function setGravity() {
    const gravitySelect = document.getElementById("gravityType");
    const gravityInput = document.getElementById("gravity");

    if (gravitySelect.value === "custom") {
        gravityInput.removeAttribute("disabled");
    } else {
        gravityInput.value = gravitySelect.value;
        gravityInput.setAttribute("disabled", "true");
    }
}

// Play sound if toggle is enabled
function playImpactSound() {
    if (!document.getElementById("soundToggle").checked) return;
    const audio = new Audio("https://www.soundjay.com/mechanical/sounds/metal-impact-1.mp3");
    audio.play();
}

// Restart everything, reset ball to center
function restartSimulation() {
    clearInterval(intervalId);
    const simCanvas = document.getElementById("simulationCanvas");
    const overlay = document.getElementById("overlayCanvas");
    const simCtx = simCanvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    simCtx.clearRect(0, 0, simCanvas.width, simCanvas.height);
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

    ballY = simCanvas.height / 2;
    updateHeightFromY();

    document.getElementById("velocity").textContent = "Velocity: ";
    document.getElementById("elapsedTime").textContent = "Elapsed Time: ";
    document.getElementById("force").textContent = "Forces: ";
    document.getElementById("pauseBtn").disabled = true;
    document.getElementById("pauseBtn").textContent = "Pause Simulation";

    drawBall(ballY);
}

// Converts Y-coordinate to height and updates the input field
// Converts the Y position of the red ball in the canvas into a height (in meters).
function updateHeightFromY() {
    const canvas = document.getElementById("simulationCanvas");
    const metersPerPixel = maxMeters / canvas.height;
    height = (canvas.height - ballY) * metersPerPixel;
    height = Math.max(0, Math.min(height, maxMeters));
    document.getElementById("height").value = height.toFixed(2);
}

// Draw the red ball at current Y
// Draws the red ball at a given Y position in the simulation canvas.
function drawBall(y) {
    const canvas = document.getElementById("simulationCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

// Draw data overlay
// Draws simulation data such as elapsed time, velocity, gravity, and drag on the overlay canvas.
function drawOverlay(elapsed, velocity, gravity, drag) {
    const overlay = document.getElementById("overlayCanvas");
    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(`Elapsed: ${elapsed.toFixed(2)}s`, 10, 20);
    ctx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 10, 40);
    ctx.fillText(`Gravity: ${gravity.toFixed(2)} m/s²`, 10, 60);
    ctx.fillText(`Drag: ${drag.toFixed(2)} m/s²`, 10, 80);
}

// Allow dragging the ball
// Handles mouse down event to detect if the user starts dragging the red ball.
window.addEventListener("mousedown", (e) => {
    const canvas = document.getElementById("simulationCanvas");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.abs(x - canvas.width / 2) < 15 && Math.abs(y - ballY) < 15) {
        isDragging = true;
    }
});

// Handles mouse movement while dragging to reposition the red ball and update height.
window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const canvas = document.getElementById("simulationCanvas");
    const rect = canvas.getBoundingClientRect();
    ballY = Math.max(0, Math.min(e.clientY - rect.top, canvas.height));
    drawBall(ballY);
    updateHeightFromY();
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

// Pause/resume toggle
// Toggles the simulation between paused and resumed states.
function pauseSimulation() {
    const pauseBtn = document.getElementById("pauseBtn");
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

// Start simulation; if resume=true, use current velocity/position
// Starts or resumes the simulation depending on the 'resume' flag.
function startSimulation(resume = false) {
    clearInterval(intervalId);
    isPaused = false;

    const gravity = parseFloat(document.getElementById("gravity").value);
    const atmosphere = document.getElementById("atmosphere").value;
    const dragCoefficient = (atmosphere === "air") ? 0.1 : 0;
    const canvas = document.getElementById("simulationCanvas");
    const overlay = document.getElementById("overlayCanvas");
    const pixelsPerMeter = canvas.height / maxMeters;

    document.getElementById("pauseBtn").disabled = false;
    document.getElementById("pauseBtn").textContent = "Pause Simulation";

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
        const y = canvas.height - position * pixelsPerMeter;
        drawBall(Math.min(canvas.height - 10, y));
        drawOverlay(elapsed, velocity, gravity, dragForce);

        if (position <= 0) {
            clearInterval(intervalId);
            drawOverlay(elapsed, 0, gravity, 0);
            playImpactSound();
            document.getElementById("pauseBtn").disabled = true;
        }
    }, 50);
}

// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
window.onload = () => {
    drawBall(ballY);
    updateHeightFromY();
};
