/*
This is the UI Control document for the Freefall Simulation.
It includes:
- Functionality for changing images
- Functionality for moving through the lesson
- Functionality for lesson navigation buttons
- Functionality hiding and showing the simulation
- (NEEDS WORK) Functionality for tooltips with equations
*/

/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */
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
    "Choose <b>Start Learning</b> to begin the lesson or <b>Sandbox</b> to use the simulator",
    "",
    "",
    "Choose below and try",
    "",
    "",
    "",
    "",
    "Drag the ball up or down to set the height, then press play to simulate."
];
const images = [
    "img/svg/newton_chalkboard.svg",
    "img/svg/newton_apple_hi.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_crossed.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg"
];

let isSandbox = false; // Flag for sandbox
let pageCount = 0; // Keep track of lesson pages
const dropSection = 3; // Page when dropSelection is needed

// Declare DOM elements globally
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
    atmosphereControls,
    simulation;

/* ==============================================================================================
    INITIALIZE VALUES FROM DOM
   ============================================================================================== */
// Sets up listeners for lesson buttons when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    declareVariables();
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
    goToLessonSection();
});

// Grabs information from HTML
function declareVariables() {
    // Get UI elements
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
    simulation = document.getElementById("simulation");

    // Set Lesson text and images
    headingText.innerHTML = headings[pageCount];
    introText.innerHTML = scripts[pageCount];
    instructionText.innerHTML = instructions[pageCount];
    isaacNewton.src = images[pageCount];
}

// Moves to the next lesson section
function nextSlide() {
    pageCount += 1;
    goToLessonSection();
}

// Moves to the previous lesson section
function backSlide() {
    pageCount -= 1;
    goToLessonSection();
}

/* ==============================================================================================
    UTILITY FUNCTIONS
   ============================================================================================== */
// Controls UI visibility and feature access depending on which lesson section is active
function goToLessonSection() {
    // Change text and images for that slide
    headingText.innerHTML = headings[pageCount];
    introText.innerHTML = scripts[pageCount];
    instructionText.innerHTML = instructions[pageCount];
    isaacNewton.src = images[pageCount];

    // Hide all optional controls by default
    simControls.style.display = "none";
    atmosphereControls.style.display = "none";
    //if (densityControls) densityControls.style.display = "none";

    // Unlock controls based on current lesson section
    dropItemSelect.style.display = simulation.style.display = pageCount >= dropSection ? "block" : "none"; // A Quick Game and onward
    backBtn.style.display = pageCount > 0 ? "inline-block" : "none";
    nextBtn.style.display = pageCount < headings.length - 1 ? "inline-block" : "none";
    nextBtn.innerHTML = pageCount > 0 ? "Next &rarr;" : "Start Learning!";
    sanboxBtn.style.display = pageCount == 0 ? "inline-block" : "none";
    //if (pageCount >= 7) atmosphereControls.style.display = "block"; // Enable air toggle
    //if (pageCount >= 8 && densityControls) densityControls.style.display = "block"; // Show buoyancy options
}

// Hides and unhides the simulation as necessary
function unlockSim() {
    isSandbox = !isSandbox;
    if (isSandbox) {
        headingText.innerHTML = "Sandbox";
        introText.innerHTML = "";
        instructionText.innerHTML = "Play with different combinations!";
        isaacNewton.src = "img/svg/newton_desk.svg";
        simControls.style.display = "block";
        atmosphereControls.style.display = "block";
        sanboxBtn.textContent = "Go Back";
        nextBtn.style.display = "none";
        simulation.style.display = "block";
    } else {
        headingText.innerHTML = headings[pageCount];
        introText.innerHTML = scripts[pageCount];
        instructionText.innerHTML = instructions[pageCount];
        isaacNewton.src = images[pageCount];
        sanboxBtn.textContent = "Sandbox";
        simControls.style.display = "none";
        atmosphereControls.style.display = "none";
        nextBtn.style.display = "";
        simulation.style.display = "none";
    }
}

/* ==============================================================================================
    EXTRA FUNCTIONS
   ============================================================================================== */
// Adds physics equations as tooltips on the overlay canvas (gravity, drag, buoyancy)
function attachEquationTooltips() {
    const overlay = document.getElementById("overlayCanvas");
    overlay.title =
        "Gravity: F = mg\n" +
        "Acceleration: v = v₀ + at\n" +
        "Air Resistance: F_drag = 0.5 * C_d * ρ * A * v²\n" +
        "Buoyancy: F_buoyancy = ρ_fluid * g * V";
}
