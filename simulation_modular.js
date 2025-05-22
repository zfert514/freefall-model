// simulation.js — modularized version
// Handles the physics simulation logic for Freefall

const SimulationController = (() => {
    /*
This is the Simulation Control document for the Freefall Simulation.
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
    const conversionCoefficient = 3.28084; // Metric to Imperial function
    let isMetric = true; // Default to metric
    let canvasSize = 300;

    // Base values for main functions
    let velocity = 0;
    let position = 0;
    let elapsed = 0;
    let gravity = 9.8;
    let drag = 0;

    const appleImage = new Image();

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
        heightUnit,
        gravityUnit;

    /* ==============================================================================================
    INITIALIZE VALUES FROM DOM
   ============================================================================================== */
    window.onload = () => {
        initialize();

        // Setup Canvas
        drawBall(ballY);
        updateHeight();
        setupListeners();
        drawOverlay(0, 0, 0, 0, parseFloat(heightInput.value));
        drawRuler();
    };

    // Grabs information from HTML
    function initialize() {
        // Get canvas and canvas set context
        simCanvas = document.getElementById("simulationCanvas");
        overlayCanvas = document.getElementById("overlayCanvas");
        simCtx = simCanvas.getContext("2d");
        overlayCtx = overlayCanvas.getContext("2d");

        // Set canvas size
        simCanvas.width = overlayCanvas.width = canvasSize;
        simCanvas.height = overlayCanvas.height = canvasSize;

        // Get UI elements
        heightInput = document.getElementById("height");
        gravityInput = document.getElementById("gravity");
        gravitySelect = document.getElementById("gravityType");
        atmosphereSelect = document.getElementById("atmosphereSelect");
        elapsedTimeDisplay = document.getElementById("elapsedTime");
        velocityDisplay = document.getElementById("velocity");
        forceDisplay = document.getElementById("force");
        pauseBtn = document.getElementById("pauseBtn");
        gravityUnit = document.getElementById("gravityUnit");
        heightUnit = document.getElementById("heightUnit");
        unitSelect = document.getElementById("unit");

        appleImage.src = "img/svg/apple_thin.svg";
    }

    /* ==============================================================================================
    SIMULATION CONTROLS
   ============================================================================================== */
    // Starts the simulation from set values
    function startSimulation(resume = false) {
        // Resets the simulation and unpauses if paused
        clearInterval(intervalId);
        isPaused = false;

        // Disables input changes while simultion is running
        heightInput.disabled = true;
        gravityInput.disabled = true;
        gravitySelect.disabled = true;
        atmosphereSelect.disabled = true;

        // Sets gravity to chosen option
        gravity = parseFloat(gravityInput.value);

        // 0.1 is the drag coefficient for a smooth sphere
        const dragCoefficient = atmosphereSelect.value === "air" ? 0.1 : 0;
        // Ratio of canvas and max height values
        const pixelsPerMeter = simCanvas.height / maxMeters;

        // Enable the pause button
        pauseBtn.disabled = false;
        pauseBtn.textContent = "Pause";

        // Set values to base, we don't do this when resuming simulation
        if (!resume) {
            velocity = 0;
            position = height;
            elapsed = 0;
        }

        // Set the start time of the simulation by subtracting the previously elapsed time.
        // This is useful for resuming the simulation without resetting the clock.
        startTime = Date.now() - elapsed * 1000;

        // Set up an interval loop that runs every 50 milliseconds (~20 FPS)
        intervalId = setInterval(() => {
            // Calculate elapsed time in seconds since startTime
            elapsed = (Date.now() - startTime) / 1000;

            // Calculate the force of air resistance (drag is 0 in vacuum)
            // Drag is proportional to the square of the velocity f=kv^2
            const dragForce = dragCoefficient * velocity * velocity;

            // Net acceleration is gravity minus drag
            const netAccel = gravity - dragForce;

            // Update velocity using the current net acceleration and a fixed timestep (0.05 seconds)
            velocity += netAccel * 0.05;

            // Update the position (height) by subtracting the amount it fell during this timestep
            position -= velocity * 0.05;

            // Stop the simulation when the object hits the ground
            if (position <= 0) {
                position = 0; // Clamp position to the ground
                clearInterval(intervalId); // Stop the interval loop
                playImpactSound(); // Optionally play a sound effect on impact
                pauseBtn.disabled = true; // Disable the pause button since it's no longer needed
            }

            // Calculate the vertical pixel position on the canvas
            // The ball is drawn from the bottom up, so subtract from canvas height
            const y = simCanvas.height - position * pixelsPerMeter;

            // Draw the ball at its new vertical position (but clamp it so it doesn't go below canvas)
            drawBall(Math.min(simCanvas.height - 10, y));

            // Draw any overlay graphics, like elapsed time, velocity, gravity, drag, and height
            drawOverlay(elapsed, velocity, gravity, dragForce, position);
        }, 50); // Run every 50 milliseconds
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

    // Reset everything, reset ball to center
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

    /* ==============================================================================================
   UTILITY FUNCTIONS
   ============================================================================================== */
    // Set gravity value from dropdown or allow custom
    function setGravity() {
        if (gravitySelect.value === "custom") {
            gravityInput.removeAttribute("disabled");
        } else {
            gravityInput.value = gravitySelect.value;
            gravityInput.setAttribute("disabled", "true");
        }
    }

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
            heightUnit.innerHTML = "m";
            gravityUnit.innerHTML = "m/s<sup>2</sup>";
        } else {
            heightInput.value = convert(height).toFixed(2);
            heightUnit.innerHTML = "ft";
            gravityUnit.innerHTML = "ft/s<sup>2</sup>";
        }
    }

    // Uses the conversionCoefficient, makes things a little simpler
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

    /* ==============================================================================================
   CANVAS DRAWING
   ============================================================================================== */
    // Create Height Comparisons starting with human height
    function drawRuler() {
        // Create Ruler
        simCtx.beginPath();
        simCtx.moveTo(simCanvas.width, simCanvas.height / 2);
        simCtx.lineTo(simCanvas.width - ruler, simCanvas.height / 2);
        simCtx.stroke();
    }

    // Draw the ball at current Y
    // Draws the ball at a given Y position in the simulation canvas.
    function drawBall(y) {
        simCtx.clearRect(0, 0, simCanvas.width - ruler, simCanvas.height); // Erases canvas each frame for animation

        // Keep y between ballSize and canvas height - ballSize
        y = Math.max(ballSize, Math.min(simCanvas.height - ballSize, y));

        // Create ball image (apple)
        const imageSize = ballSize * 2;
        const x = simCanvas.width / 2 - ballSize;
        const drawY = y - ballSize;
        simCtx.drawImage(appleImage, x, drawY, imageSize, imageSize);
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

    /* ==============================================================================================
   DRAG FUNCTIONALITY
   ============================================================================================== */
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

    /* ==============================================================================================
   EXTRA CONTROLS
   ============================================================================================== */
    // Play sound if toggle is enabled
    function playImpactSound() {
        if (!document.getElementById("soundToggle").checked) return;
        const audio = new Audio("https://www.soundjay.com/mechanical/sounds/metal-impact-1.mp3");
        audio.play();
    }

    return {
        start: startSimulation,
        pause: pauseSimulation,
        restart: restartSimulation
    };
})();

// Optional: bind controls here if needed
// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("startBtn").addEventListener("click", SimulationController.start);
// });
