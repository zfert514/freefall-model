/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */
// Script
let headings = [
    "",
    "Meet Newton",
    "What Goes Up...",
    "A Quick Game",
    "Try It Yourself",
    "Is Gravity Pulling Constantly?",
    "Air Makes Things Interesting",
    "What About Buoyancy?",
    "You Discovered the Science of Falling"
];
const scripts = [
    "",
    "Hi there! I'm Sir Isaac Newton <i>(but my friends just call me Newton)</i> and this is my friend Mr. Apple. We're here to help you understand something amazing: how things fall!",
    "When we drop something, we know it falls to the ground. But have you ever stopped to wonder *why*? Maybe you've heard the word \"gravity.\" Let's learn a little more about how that works.",
    "Let's try something. I'm going to drop my friend Mr. Apple and you choose one of the items below to drop. Try to choose something that will fall faster than Mr. Apple.",
    "Use the simulation below. You can: • Drag Apple to change the starting height • Press 'Start' to see how it falls. What do you notice?",
    "Now watch two objects fall: • One falls at a constant speed • One falls like a real object. Which one looks more like real life? The real one speeds up as it falls. That’s acceleration!",
    'Try switching the atmosphere from "Vacuum" to "Air." You’ll see lighter things fall more slowly. That’s air resistance—air pushing back on things that fall.',
    "Buoyancy is what makes things float—like a balloon in air or a duck in a tub. Try placing a low-density object in the simulation—it might float! Now try a heavier one. See how density and buoyancy affect motion.",
    "Gravity pulls. Air resists. Buoyancy pushes. You’ve learned why rocks fall, feathers float, and balloons rise. Great job!"
];

const instructions = [
    "Click \"Start Learning\" to begin the lesson or Click sandbox to use the Freefall Simulator",
    "Drag the ball up or down to set the height, then press play to simulate.",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];
const images = [
    "img/svg/newton_chalkboard.svg",
    "img/svg/newton_apple_hi.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg"
];

let nextBtn,
    header,
    backBtn,
    introText,
    headingText,
    instructionText,
    dropItemSelect,
    isaacNewton,
    simControls,
    densityControls,
    atmosphereControls;

let isSandbox = false;
let pageCount = 0;
const dropSection = 3;
/* ==============================================================================================

   ============================================================================================== */
// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
document.addEventListener("DOMContentLoaded", () => {
    declareVariables();
    headingText.innerHTML = headings[pageCount];
    introText.innerHTML = scripts[pageCount];
    instructionText.innerHTML = instructions[pageCount];
    isaacNewton.src = images[pageCount];
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
        });
    }

    if (sandboxBtn) {
        sandboxBtn.addEventListener("click", () => {
            unlockSim();
        });
    }

    if (backBtn) {
        backBtn.addEventListener("click", () => {
            backSlide();
        });
    }
});

function declareVariables() {
    sanboxBtn = document.getElementById("sandboxBtn");
    nextBtn = document.getElementById("nextBtn");
    backBtn = document.getElementById("backBtn");
    introText = document.getElementById("intro");
    headingText = document.getElementById("heading");
    instructionText = document.getElementById("instruction");
    dropItemSelect = document.getElementById("dropItemSelect");
    isaacNewton = document.getElementById("isaacNewton");
    simControls = document.getElementById("simControls");
    gravityLabel = document.getElementById("gravityLabel");
    atmosphereControls = document.getElementById("atmosphereControls");
    densityControls = document.getElementById("densityControls");
}

// Start simulation; if resume=true, use current velocity/position
// Starts or resumes the simulation depending on the 'resume' flag.
function nextSlide() {
    pageCount += 1;
    goToLessonSection();
}
function backSlide() {
    pageCount -= 1;
    goToLessonSection();
}

/* ==============================================================================================

   Controls UI visibility and feature access depending on which lesson section is active
   ============================================================================================== */
function goToLessonSection() {
    // Hide all optional controls by default
    headingText.innerHTML = headings[pageCount];
    introText.innerHTML = scripts[pageCount];
    instructionText.innerHTML = instructions[pageCount];
    isaacNewton.src = images[pageCount];

    backBtn.style.display = pageCount > 0 ? "inline-block" : "none";
    nextBtn.style.display = pageCount < headings.length - 1 ? "inline-block" : "none";
    nextBtn.innerHTML = pageCount > 0 ? "Next &rarr;" : "Start Learning!";
    sanboxBtn.style.display = pageCount == 0  ? "inline-block" : "none";

    simControls.style.display = "none";
    atmosphereControls.style.display = "none";
    gravityLabel.style.display = "none";
    if (densityControls) densityControls.style.display = "none";

    // Unlock controls based on current lesson section
    if (pageCount == dropSection) {
        //nextBtn.disabled = true;
        dropItemSelect.style.display = "";
    }
    if (pageCount >= 4) simControls.style.display = "block"; // Try It Yourself and onward
    if (pageCount >= 7) atmosphereControls.style.display = "block"; // Enable air toggle
    if (pageCount >= 8 && densityControls) densityControls.style.display = "block"; // Show buoyancy options
}

/* ==============================================================================================

   Adds physics equations as tooltips on the overlay canvas (gravity, drag, buoyancy)
   ============================================================================================== */
function attachEquationTooltips() {
    const overlay = document.getElementById("overlayCanvas");
    overlay.title =
        "Gravity: F = mg\n" +
        "Acceleration: v = v₀ + at\n" +
        "Air Resistance: F_drag = 0.5 * C_d * ρ * A * v²\n" +
        "Buoyancy: F_buoyancy = ρ_fluid * g * V";
}

function unlockSim() {
    isSandbox = !isSandbox;
    if (isSandbox) {
        headingText.innerHTML = "Sandbox";
        introText.innerHTML = "";
        instructionText.innerHTML = "Play with different combinations!";
        isaacNewton.src = "img/svg/newton_chalkboard.svg";
        simControls.style.display = "block";
        atmosphereControls.style.display = "block";
        sanboxBtn.textContent = "Go Back";
        nextBtn.style.display = "none";
    } else {
        headingText.innerHTML = headings[pageCount];
        introText.innerHTML = scripts[pageCount];
        instructionText.innerHTML = instructions[pageCount];
        isaacNewton.src = images[pageCount];
        sanboxBtn.textContent = "Sandbox";
        simControls.style.display = "none";
        atmosphereControls.style.display = "none";
        nextBtn.style.display = "";
    }
}
