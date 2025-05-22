/*
This is the Apple falling animation document for the Freefall Simulation.
It includes:
- Functionality for randomly creating an apple
- Functionality for animating the apple fall with one bounce
- Functionality for drawing a fading mouse trail of apples
*/

/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */
// Declare DOM elements globally
let appleCanvas, appleCtx, appleImg, apple, lastTime;

// Mouse trail storage
let mouseTrail = []; // each entry: { x, y, life }

/* ==============================================================================================
   FALLING APPLE + MOUSE TRAIL ANIMATION
   ============================================================================================== */
window.addEventListener("DOMContentLoaded", () => {
    // Get reference to the canvas where apples (and mouse trail) will be drawn
    appleCanvas = document.getElementById("appleCanvas");
    appleCtx = appleCanvas.getContext("2d");

    // Load the apple image (used for both the falling apple and mouse trail)
    appleImg = new Image();
    appleImg.src = "img/svg/apple_thin.svg";

    // Apple state
    apple = null;
    lastTime = 0;

    // Match canvas to its CSS size
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // When the apple image is ready, start spawning & animating
    appleImg.onload = () => {
        spawnApple();
        requestAnimationFrame(animateBanner);
    };

    // Track mouse movements over the canvas
    document.addEventListener("mousemove", trackMouse);
});

/* ==============================================================================================
   CANVAS RESIZE
   ============================================================================================== */
function resizeCanvas() {
    appleCanvas.width = appleCanvas.offsetWidth;
    appleCanvas.height = appleCanvas.offsetHeight;
}

/* ==============================================================================================
   APPLE SPAWNING & PHYSICS
   ============================================================================================== */
function spawnApple() {
    const x = Math.random() * appleCanvas.width;
    apple = { x, y: -50, vx: 0, vy: 0, rotation: 0, bounced: false, trail: [] };
}

/* ==============================================================================================
   MAIN LOOP
   ============================================================================================== */
function animateBanner(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    // Clear entire canvas (apple + mouse trail)
    appleCtx.clearRect(0, 0, appleCanvas.width, appleCanvas.height);

    updateApple(dt);
    updateMouseTrail(dt);

    // Draw the mouse trail of apples behind the falling apple
    drawMouseTrail();

    // Draw your bouncing apple
    drawApple();

    requestAnimationFrame(animateBanner);
}

/* ==============================================================================================
   APPLE LOGIC
   ============================================================================================== */
function updateApple(dt) {
    if (!apple) return;

    // gravity
    apple.vy += 0.002 * dt;
    apple.y += apple.vy * dt;
    apple.rotation += 0.002 * dt;

    // build a simple trail for the apple itself (optional)
    apple.trail.push({ x: apple.x, y: apple.y, opacity: 1, rotation: apple.rotation });
    if (apple.trail.length > 10) apple.trail.shift();
    apple.trail.forEach((dot, i) => (dot.opacity = 0.7 - i / apple.trail.length));

    // bounce
    const ground = appleCanvas.height - 40;
    if (apple.y >= ground && !apple.bounced) {
        apple.vy = -0.4 * Math.sqrt(apple.vy);
        apple.vx = (Math.random() - 0.5) * 2;
        apple.bounced = true;
    }
    // respawn off‐screen
    else if (apple.y > appleCanvas.height + 50) {
        apple = null;
        setTimeout(spawnApple, 1000);
    }
}

function drawApple() {
    if (!apple) return;

    // draw apple’s own fading trail (optional)
    for (let t of apple.trail) {
        appleCtx.globalAlpha = t.opacity * 0.5;
        appleCtx.drawImage(appleImg, t.x - 20, t.y - 20, 40, 40);
    }

    // draw the main apple
    appleCtx.save();
    appleCtx.translate(apple.x, apple.y);
    appleCtx.rotate(apple.rotation);
    appleCtx.globalAlpha = 1;
    appleCtx.drawImage(appleImg, -20, -20, 40, 40);
    appleCtx.restore();
}

/* ==============================================================================================
   MOUSE TRAIL LOGIC (now draws apples)
   ============================================================================================== */
function trackMouse(e) {
    const rect = appleCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add a fresh dot with full “life” (1.0)
    mouseTrail.push({ x, y, life: 1.0 });

    // Keep trail length reasonable
    if (mouseTrail.length > 50) mouseTrail.shift();
}

function updateMouseTrail(dt) {
    // Fade each dot’s life down over time
    for (let dot of mouseTrail) {
        dot.life -= dt * 0.002; // tweak fade speed here
    }
    // Remove fully-faded dots
    mouseTrail = mouseTrail.filter((dot) => dot.life > 0);
}

function drawMouseTrail() {
    const size = 24; // apple icon size for the trail
    for (let dot of mouseTrail) {
        appleCtx.globalAlpha = dot.life * 0.6; // semi-transparent based on life
        appleCtx.drawImage(appleImg, dot.x - size / 2, dot.y - size / 2, size, size);
    }
    appleCtx.globalAlpha = 1; // reset
}
