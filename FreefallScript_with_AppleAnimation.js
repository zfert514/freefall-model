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
let ballSize = 10; // Radius of the ball
let ruler = 20; // Length of the ruler
const conversionCoefficient = 3.28084;
let isMetric = true;

let velocity = 0;
let position = 0;
let elapsed = 0;
let gravity = 9.8;
let drag = 0;

// Declare DOM elements globally
let simCanvas, overlayCanvas, simCtx, overlayCtx;
let heightInput,
    gravityInput,
    gravitySelect,
    atmosphereSelect,
    elapsedTimeDisplay,
    velocityDisplay,
    forceDisplay,
    pauseBtn,
    heightLabel,
    gravityLabel;

/* ============================
   PAGE LOAD
   ============================ */
// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
window.onload = () => {
    // Get canvas and canvas set context
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
    gravityLabel = document.getElementById("heightLabel");
    heightLabel = document.getElementById("gravityLabel");
    unitSelect = document.getElementById("unit");

    // Setup Canvas
    drawBall(ballY);
    updateHeight();
    setupListeners();
    drawOverlay(0, 0, 0, 0, parseFloat(heightInput.value));
    drawRuler();
};

/* ============================
   UTILITY FUNCTIONS
   ============================ */
// Change unit between m and ft
function changeUnit() {
    isMetric = !isMetric;
    // Allows for change during simulation
    if (velocity > 0) {
        drawOverlay(elapsed, velocity, gravity, drag, position);
    } else {
        drawOverlay(elapsed, velocity, gravity, drag, height);
    }
    // Changes height input
    if (isMetric) {
        heightInput.value = height.toFixed(2);
    } else {
        heightInput.value = convert(height).toFixed(2);
    }
}

function convert(meter) {
    return meter * conversionCoefficient;
}

// Converts Y-coordinate to height and updates the input field
// Converts the Y position of the red ball in the canvas into a height (in meters) to 2 decimal points.
function updateHeight() {
    const metersPerPixel = maxMeters / simCanvas.height;
    height = (simCanvas.height - ballY) * metersPerPixel;
    if (isMetric) {
        heightInput.value = height.toFixed(2);
    } else {
        heightInput.value = convert(height).toFixed(2);
    }
    drawOverlay(elapsed, velocity, gravity, drag, height);
}

// Create Height Comparisons starting with human height
function drawRuler() {
    // Create Ruler
    simCtx.beginPath();
    simCtx.moveTo(simCanvas.width, simCanvas.height / 2);
    simCtx.lineTo(simCanvas.width - ruler, simCanvas.height / 2);
    simCtx.stroke();
}

// Draw the red ball at current Y
// Draws the red ball at a given Y position in the simulation canvas.
function drawBall(y) {
    simCtx.clearRect(0, 0, simCanvas.width - ruler, simCanvas.height); // Erases canvas each frame for animation

    // Keep y between ballSize and canvas height - ballSize
    y = Math.max(ballSize, Math.min(simCanvas.height - ballSize, y));

    simCtx.beginPath();
    simCtx.arc(simCanvas.width / 2, y, ballSize, 0, Math.PI * 2); // Creates ball centrally
    simCtx.fillStyle = "red";
    simCtx.fill();
}

// Draw data overlay
// Draws simulation data such as elapsed time, velocity, gravity, and drag on the overlay canvas.
function drawOverlay(elapsed, velocity, gravity, drag, height) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.font = "12px sans-serif";
    overlayCtx.fillStyle = "black";
    overlayCtx.fillText(`Elapsed: ${elapsed.toFixed(2)}s`, 10, 20);
    if (isMetric) {
        overlayCtx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`, 10, 40);
        overlayCtx.fillText(`Height: ${height.toFixed(2)} m`, 10, 60);
        if (atmosphereSelect.value == "air") {
            overlayCtx.fillText(`Drag: ${drag.toFixed(2)} m/s²`, 10, 80);
        }
        //overlayCtx.fillText(`Gravity: ${gravity.toFixed(2)} m/s²`, 10, 80);
    } else {
        overlayCtx.fillText(`Velocity: ${convert(velocity).toFixed(2)} ft/s`, 10, 40);
        overlayCtx.fillText(`Height: ${convert(height).toFixed(2)} ft`, 10, 60);
        if (atmosphereSelect.value == "air") {
            overlayCtx.fillText(`Drag: ${convert(drag).toFixed(2)} ft/s²`, 10, 80);
        }
        //overlayCtx.fillText(`Gravity: ${gravity.toFixed(2)} m/s²`, 10, 80);
    }
}

// Moves ball when height input is changed
function repsoitionBall() {
    // Get new height value
    const newHeight = parseFloat(document.getElementById("height").value);

    // Convert to canvas Y position
    const pixelsPerMeter = simCanvas.height / maxMeters;
    ballY = simCanvas.height - newHeight * pixelsPerMeter;

    drawBall(ballY); // Update ball position
    updateHeight(); // Recalculate height from Y if needed
}

/* ============================
   DRAG FUNCTIONALITY
   ============================ */
// Find if mouse is near circle
function checkMouse(e) {
    const rect = simCanvas.getBoundingClientRect(); // Get canvas position
    const x = e.clientX - rect.left; // Get mouse x relative to canvas
    const y = e.clientY - rect.top; // Get mouse y relative to canvas
    if (Math.abs(x - simCanvas.width / 2) < 15 && Math.abs(y - ballY) < 15) {
        isDragging = true; // If the mouse is within 15px ball center allow drag
    }
}

// Handles mouse movement within canvas while dragging to reposition the red ball and update height.
function dragBall(e) {
    if (!isDragging) return;
    const rect = simCanvas.getBoundingClientRect();
    ballY = Math.max(0, Math.min(e.clientY - rect.top, simCanvas.height));
    drawBall(ballY);
    updateHeight();
}

// Allow dragging the ball
// Handles mouse down event to detect if the user starts dragging the red ball.
function setupListeners() {
    // DRAG EVENTS
    simCanvas.addEventListener("mousedown", (e) => {
        checkMouse(e);
    });

    simCanvas.addEventListener("mousemove", (e) => {
        dragBall(e);
    });

    // Window in case mouseup happens outside of canvas
    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // INPUT EVENTS
    heightInput.addEventListener("input", () => {
        repsoitionBall();
    });

    document.querySelectorAll('input[name="unit"]').forEach((radio) => {
        radio.addEventListener("change", changeUnit);
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
    pauseBtn.textContent = "Pause";

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
        drawOverlay(elapsed, velocity, gravity, dragForce, position);
    }, 50);
}

// Pause/resume toggle
// Toggles the simulation between paused and resumed states.
function pauseSimulation() {
    if (!isPaused) {
        clearInterval(intervalId);
        isPaused = !isPaused;
        pauseBtn.textContent = "Resume";
    } else {
        pauseBtn.textContent = "Pause";
        isPaused = !isPaused;
        startSimulation(true);
    }
}

// Restart everything, reset ball to center
function restartSimulation() {
    clearInterval(intervalId);
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";

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
    drawOverlay(0, 0, 0, 0, height);
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

/* ============================
   EXTRA CONTROLS
   ============================ */
//s
function nextText() {

}

// === Falling Apple Banner Animation ===
const canvas = document.getElementById('appleCanvas');
const ctx = canvas.getContext('2d');

let appleImg = new Image();
appleImg.src = 'apple_1.svg';

let apple = null;
let lastTime = 0;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnApple() {
    const x = Math.random() * canvas.width;
    apple = {
        x,
        y: -50,
        vx: 0,
        vy: 0,
        rotation: 0,
        bounced: false,
        trail: []
    };
}

function updateApple(dt) {
    if (!apple) return;

    // Apply gravity
    apple.vy += 0.002 * dt;
    apple.y += apple.vy * dt;
    apple.rotation += 0.002 * dt;

    // Store trail
    apple.trail.push({ x: apple.x, y: apple.y, opacity: 1.0 });
    if (apple.trail.length > 10) apple.trail.shift();
    apple.trail.forEach((dot, i) => {
        dot.opacity = 1 - i / apple.trail.length;
    });

    // Bounce
    const ground = canvas.height - 40;
    if (apple.y >= ground && !apple.bounced) {
        apple.vy = -0.4 * Math.sqrt(apple.vy);
        apple.bounced = true;
    } else if (apple.y > canvas.height + 50) {
        apple = null;
        setTimeout(spawnApple, 1000);
    }
}

function drawApple() {
    if (!apple) return;

    // Draw trail
    for (let t of apple.trail) {
        ctx.globalAlpha = t.opacity * 0.5;
        ctx.drawImage(appleImg, t.x - 20, t.y - 20, 40, 40);
    }

    // Draw apple
    ctx.save();
    ctx.translate(apple.x, apple.y);
    ctx.rotate(apple.rotation);
    ctx.globalAlpha = 1;
    ctx.drawImage(appleImg, -20, -20, 40, 40);
    ctx.restore();
}

function animateBannerApple(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateApple(dt);
    drawApple();

    requestAnimationFrame(animateBannerApple);
}

appleImg.onload = () => {
    spawnApple();
    requestAnimationFrame(animateBannerApple);
};
