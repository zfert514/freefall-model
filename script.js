/*
Freefall Simulation Script
--------------------------
This script controls the simulation of an object in freefall. It includes:
- Gravity presets (Earth, Moon, Mars, Vacuum, Custom)
- Atmosphere options (air or vacuum)
- Real-time animation of falling object
- Calculation and display of velocity, time, and forces
- Optional sound effect on impact
*/

let intervalId = null;       // For managing the animation loop
let startTime = null;        // To track when simulation starts

// Set gravity based on the dropdown selection
function setGravity() {
    const gravitySelect = document.getElementById("gravityType");
    const gravityInput = document.getElementById("gravity");

    if (gravitySelect.value === "custom") {
        gravityInput.removeAttribute("disabled"); // Allow editing
    } else {
        gravityInput.value = gravitySelect.value; // Set gravity
        gravityInput.setAttribute("disabled", "true");
    }
}

// Play a metal impact sound when the object hits the ground
function playImpactSound() {
    if (!document.getElementById("soundToggle").checked) return;
    const audio = new Audio("https://www.soundjay.com/mechanical/sounds/metal-impact-1.mp3");
    audio.play();
}

// Start the simulation and animate the falling object
function startSimulation() {
    clearInterval(intervalId); // Stop previous simulation if running

    // Get user inputs
    const height = parseFloat(document.getElementById("height").value);
    const gravity = parseFloat(document.getElementById("gravity").value);
    const atmosphere = document.getElementById("atmosphere").value;

    // UI elements to update
    const velocityOutput = document.getElementById("velocity");
    const timeOutput = document.getElementById("elapsedTime");
    const forceOutput = document.getElementById("force");

    // Simulation variables
    let dragCoefficient = (atmosphere === "air") ? 0.1 : 0; // Simple drag simulation
    let velocity = 0;
    let position = height;
    let elapsed = 0;

    startTime = Date.now();

    // Setup for animation
    const ball = document.getElementById("ball");
    const containerHeight = document.getElementById("animationArea").clientHeight;
    const pixelsPerMeter = containerHeight / height;

    ball.style.top = "0px";

    intervalId = setInterval(() => {
        // Update time and physics
        elapsed = (Date.now() - startTime) / 1000;
        let dragForce = dragCoefficient * velocity * velocity;
        let netAcceleration = gravity - dragForce;

        velocity += netAcceleration * 0.05;       // Update velocity
        position -= velocity * 0.05;              // Update position

        // Update UI values
        if (position <= 0) {
            clearInterval(intervalId);
            playImpactSound();
            velocityOutput.textContent = "Velocity: 0 m/s (landed)";
            timeOutput.textContent = `Elapsed Time: ${elapsed.toFixed(2)} s`;
            forceOutput.textContent = `Force of Gravity: ${gravity.toFixed(2)} m/s², Drag: ${dragForce.toFixed(2)} m/s²`;
            ball.style.top = containerHeight - 20 + "px"; // Position at bottom
        } else {
            velocityOutput.textContent = `Velocity: ${velocity.toFixed(2)} m/s`;
            timeOutput.textContent = `Elapsed Time: ${elapsed.toFixed(2)} s`;
            forceOutput.textContent = `Force of Gravity: ${gravity.toFixed(2)} m/s², Drag: ${dragForce.toFixed(2)} m/s²`;

            const currentTop = (height - position) * pixelsPerMeter;
            ball.style.top = Math.min(currentTop, containerHeight - 20) + "px";
        }
    }, 50);
}

// Reset simulation and reset ball position with animation
function restartSimulation() {
    clearInterval(intervalId);
    document.getElementById("velocity").textContent = "Velocity: ";
    document.getElementById("elapsedTime").textContent = "Elapsed Time: ";
    document.getElementById("force").textContent = "Forces: ";

    const ball = document.getElementById("ball");
    ball.style.transition = "top 0.5s ease-out";
    ball.style.top = "0px";
    setTimeout(() => {
        ball.style.transition = "";
    }, 500);
}
