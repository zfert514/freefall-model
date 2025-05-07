
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

function playImpactSound() {
    if (!document.getElementById("soundToggle").checked) return;
    const audio = new Audio("https://www.soundjay.com/mechanical/sounds/metal-impact-1.mp3");
    audio.play();
}

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

let intervalId = null;
let startTime = null;

function startSimulation() {
    clearInterval(intervalId);  // Clear any previous simulation
    const height = parseFloat(document.getElementById("height").value);
    const gravity = parseFloat(document.getElementById("gravity").value);
    const atmosphere = document.getElementById("atmosphere").value;
    const velocityOutput = document.getElementById("velocity");
    const timeOutput = document.getElementById("elapsedTime");
    const forceOutput = document.getElementById("force");

    let dragCoefficient = (atmosphere === "air") ? 0.1 : 0; // simple drag simulation
    let velocity = 0;
    let position = height;
    let elapsed = 0;

    startTime = Date.now();
    intervalId = setInterval(() => {
        elapsed = (Date.now() - startTime) / 1000;
        let dragForce = dragCoefficient * velocity * velocity;
        let netAcceleration = gravity - dragForce;
        velocity += netAcceleration * 0.05;  // timestep = 0.05s
        position -= velocity * 0.05;

        if (position <= 0) {
            clearInterval(intervalId);
            velocityOutput.textContent = "Velocity: 0 m/s (landed)";
            timeOutput.textContent = `Elapsed Time: ${elapsed.toFixed(2)} s`;
            forceOutput.textContent = `Force of Gravity: ${(gravity).toFixed(2)} m/s², Drag: ${(dragForce).toFixed(2)} m/s²`;
        } else {
            velocityOutput.textContent = `Velocity: ${velocity.toFixed(2)} m/s`;
            timeOutput.textContent = `Elapsed Time: ${elapsed.toFixed(2)} s`;
            forceOutput.textContent = `Force of Gravity: ${(gravity).toFixed(2)} m/s², Drag: ${(dragForce).toFixed(2)} m/s²`;
        }
    }, 50);
}

function restartSimulation() {
    clearInterval(intervalId);
    document.getElementById("velocity").textContent = "Velocity: ";
    document.getElementById("elapsedTime").textContent = "Elapsed Time: ";
    document.getElementById("force").textContent = "Forces: ";
}


        // Animate the ball
        const ball = document.getElementById("ball");
        const containerHeight = document.getElementById("animationArea").clientHeight;
        const pixelsPerMeter = containerHeight / height;

        let currentTop = 0;

        ball.style.top = "0px";

        intervalId = setInterval(() => {
            elapsed = (Date.now() - startTime) / 1000;
            let dragForce = dragCoefficient * velocity * velocity;
            let netAcceleration = gravity - dragForce;
            velocity += netAcceleration * 0.05;  // timestep = 0.05s
            position -= velocity * 0.05;

            if (position <= 0) {
                clearInterval(intervalId);
                velocityOutput.textContent = "Velocity: 0 m/s (landed)";
                timeOutput.textContent = `Elapsed Time: ${elapsed.toFixed(2)} s`;
                forceOutput.textContent = `Force of Gravity: ${(gravity).toFixed(2)} m/s², Drag: ${(dragForce).toFixed(2)} m/s²`;
                ball.style.top = containerHeight - 20 + "px";  // land at bottom
            } else {
                velocityOutput.textContent = `Velocity: ${velocity.toFixed(2)} m/s`;
                timeOutput.textContent = `Elapsed Time: ${elapsed.toFixed(2)} s`;
                forceOutput.textContent = `Force of Gravity: ${(gravity).toFixed(2)} m/s², Drag: ${(dragForce).toFixed(2)} m/s²`;

                currentTop = (height - position) * pixelsPerMeter;
                ball.style.top = Math.min(currentTop, containerHeight - 20) + "px";
            }
        }, 50);
