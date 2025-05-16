/*
This is the Apple falling animation document for the Freefall Simulation.
It includes:
- Functionality for randomly creating an apple
- Functionality for animating the apple fall with one bounce
*/

/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */
// Declare DOM elements globally
let appleCanvas, appleImg, apple, lastTime;

/* ==============================================================================================
   FALLING APPLE ANIMATION
   ============================================================================================== */
// Wait for the DOM to load before accessing elements
window.addEventListener("DOMContentLoaded", () => {
    // Get reference to the canvas where apples will be drawn
    appleCanvas = document.getElementById("appleCanvas");
    appleCtx = appleCanvas.getContext("2d");

    // Load the apple image
    appleImg = new Image();
    appleImg.src = "img/svg/apple_thin.svg";

    // Declare apple object and time tracking
    apple = null;
    lastTime = 0;

    // Set initial canvas size to match container
    resizeCanvas();

    // Once the apple image is loaded, start the animation
    appleImg.onload = () => {
        spawnApple(); // Create the first apple
        requestAnimationFrame(animateBannerApple); // Start the animation loop
    };
});

/* ==============================================================================================
    UTILITY FUNCTIONS
   ============================================================================================== */
// Resize the canvas to match its displayed size
function resizeCanvas() {
    appleCanvas.width = appleCanvas.offsetWidth;
    appleCanvas.height = appleCanvas.offsetHeight;
}

// Create a new apple falling from a random x-position at the top
function spawnApple() {
    const x = Math.random() * appleCanvas.width;
    apple = {
        x, // horizontal position
        y: -50, // start above the top of the canvas
        vx: 0, // horizontal velocity
        vy: 0, // vertical velocity
        rotation: 0, // rotation angle
        bounced: false, // track whether it has bounced
        trail: [] // array for storing trail positions
    };
}

// Animation loop using requestAnimationFrame
function animateBannerApple(timestamp) {
    const dt = timestamp - lastTime; // Time since last frame
    lastTime = timestamp;

    appleCtx.clearRect(0, 0, appleCanvas.width, appleCanvas.height); // Clear previous frame

    updateApple(dt); // Move and simulate physics
    drawApple(); // Render the apple and its trail

    requestAnimationFrame(animateBannerApple); // Loop again
}

// Update the apple's position, velocity, and trail
function updateApple(dt) {
    if (!apple) return;

    // Apply gravity to vertical velocity
    apple.vy += 0.002 * dt;

    // Move apple based on velocity
    apple.y += apple.vy * dt;

    // Increase rotation
    apple.rotation += 0.002 * dt;

    // Save current position for trail
    apple.trail.push({ x: apple.x, y: apple.y, opacity: 1, rotation: apple.rotation });

    // Limit trail to 10 entries
    if (apple.trail.length > 10) apple.trail.shift();

    // Fade out trail from newest to oldest
    apple.trail.forEach((dot, i) => {
        dot.opacity = 0.7 - i / apple.trail.length;
    });

    // Set bounce threshold near bottom of canvas
    const ground = appleCanvas.height - 40;

    // If apple reaches ground and hasn't bounced yet, bounce it
    if (apple.y >= ground && !apple.bounced) {
        apple.vy = -0.4 * Math.sqrt(apple.vy); // Reverse and dampen vertical velocity
        apple.vx = (Math.random() - 0.5) * 2;  // Add small random left/right push
        apple.bounced = true;
    }
    // If apple has gone off screen, remove it and spawn another after a delay
    else if (apple.y > appleCanvas.height + 50) {
        apple = null;
        setTimeout(spawnApple, 1000);
    }
}

// Draw the apple and its trail on the canvas
function drawApple() {
    if (!apple) return;

    // Draw fading trail circles
    for (let t of apple.trail) {
        appleCtx.globalAlpha = t.opacity * 0.5;
        appleCtx.drawImage(appleImg, t.x - 20, t.y - 20, 40, 40);
    }

    // Draw the main apple, rotated
    appleCtx.save(); // Save current canvas state
    appleCtx.translate(apple.x, apple.y); // Move origin to apple position
    appleCtx.rotate(apple.rotation); // Rotate around that origin
    appleCtx.globalAlpha = 1; // Set full opacity
    appleCtx.drawImage(appleImg, -20, -20, 40, 40); // Draw the apple centered
    appleCtx.restore(); // Restore original canvas state
}
