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
    "Gravity & Acceleration",
    "Water Displacement",
    "Interactive Water Displacement",
    "What About Buoyancy?",
    "When Buoyancy Wins",
    "Air as a Fluid",
    "Vacuum vs Air",
    "Terminal Velocity",
    "You Discovered the Science of Falling"
];
const scripts = [
    "",

    // 1) Intro to Newton & Apple
    `Hi there! I'm Sir Isaac Newton <i>(but my friends just call me Newton)</i> and this is my friend Mr. Apple. 
  We're here to help you understand something amazing: how things fall!`,

    // 2) What is gravity?
    `When we drop something, we know it falls to the ground. But have you ever stopped to wonder *why*? 
  Maybe you've heard the word "gravity." Let's learn a little more about how that works.`,

    // 3) Quick game prompt
    `Let's try something. I'm going to drop my friend Mr. Apple and you choose one of the items below to drop. 
  Try to choose something that will fall faster than Mr. Apple.`,

    // 4) Sandbox simulation intro
    `Use the simulation below. You can:
   • Drag Apple to change the starting height  
   • Press 'Start' to see how it falls.  
  What do you notice?`,

    // 5) Constant vs accelerating fall
    `Now watch two objects fall:
   • One falls at a constant speed  
   • One falls like a real object.  
  Which one looks more like real life? The real one speeds up as it falls. That’s acceleration!`,

    // 6) Relationship of acceleration & gravity
    `Acceleration on Earth happens because gravity pulls all objects toward its center at about 9.8 m/s². 
  No matter their mass, everything speeds up downward at the same rate under gravity.`,

    // 7) Water displacement concept
    `When you drop something into water, it pushes water molecules out of its way—this is called displacement. 
  The displaced water pushes back on the object, slowing its fall more than air resistance alone.`,

    // 8) Interactive water-displacement activity
    `Try this interactive: drop different objects into the water chamber below. 
  Watch how quickly each sinks and how water displacement changes their speed.`,

    // 9) Buoyancy intro
    `Buoyancy is what makes things float—like a balloon in air or a duck in a tub. 
  Try placing a low-density object in the simulation—it might float! Now try a heavier one. 
  See how density and buoyancy affect motion.`,

    // 10) When buoyancy overcomes gravity
    `If an object is less dense than the fluid it’s in, the buoyant force can exceed gravity, 
  causing it to rise instead of sink.`,

    // 11) Air as a fluid
    `In the real world, air behaves like a light fluid. As an apple falls, it must push air molecules aside, 
  which slows its descent—just like water, but much less dense.`,

    // 12) Vacuum vs Air
    `Try switching the atmosphere from "Vacuum" to "Air."  
  You’ll see lighter things fall more slowly. That’s air resistance—air pushing back on things that fall.`,

    // 13) Terminal velocity
    `If an object falls long enough, air resistance and gravity balance out so it stops accelerating. 
  That stable speed is called terminal velocity—the maximum speed it will reach as it falls.`,

    // 14) Wrap-up
    `Gravity pulls. Air resists. Buoyancy pushes.  
  You’ve learned why rocks fall, feathers float, and balloons rise. Great job!`
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
    simulation,
    canvases,
    sandboxBtn,
    simulationButtons;

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

    updateLessonView();
});

// Grabs information from HTML
function declareVariables() {
    // Get UI elements
    nextBtn = document.getElementById("nextBtn");
    backBtn = document.getElementById("backBtn");
    sandboxBtn = document.getElementById("sandboxBtn");

    headingText = document.getElementById("heading");
    introText = document.getElementById("intro");
    instructionText = document.getElementById("instruction");
    isaacNewton = document.getElementById("isaacNewton");
    dropItemSelect = document.getElementById("dropItemSelect");

    simControls = document.getElementById("simControls");
    atmosphereControls = document.getElementById("atmosphereControls");
    densityControls = document.getElementById("densityControls");

    simulation = document.getElementById("simulation");
    canvases = document.getElementById("canvases");
    simulationButtons = document.getElementById("simulationButtons");

    simCanvas = document.getElementById("simulationCanvas");
    overlayCanvas = document.getElementById("overlayCanvas");
    gameCanvas = document.getElementById("gameCanvas");

    updateLessonView();
}

// Moves to the next lesson section
function nextSlide() {
    pageCount++;
    updateLessonView();
}

// Moves to the previous lesson section
function backSlide() {
    pageCount--;
    updateLessonView();
}

/* ==============================================================================================
    UTILITY FUNCTIONS
   ============================================================================================== */
// Controls UI visibility and feature access depending on which lesson section is active
function updateLessonView() {
    // Change text and images for that slide
    headingText.innerHTML = headings[pageCount];
    introText.innerHTML = scripts[pageCount];
    instructionText.innerHTML = instructions[pageCount];
    isaacNewton.src = images[pageCount];

    // Hide all optional controls by default
    simControls.style.display = "none";
    atmosphereControls.style.display = "none";
    gameCanvas.style.display = "none";
    simCanvas.style.display = "none";
    overlayCanvas.style.display = "none";
    dropItemSelect.style.display = "none";
    simulationButtons.style.display = "none";
    //if (densityControls) densityControls.style.display = "none";

    // Unlock controls based on current lesson section
    simulation.style.display = pageCount >= dropSection ? "block" : "none"; // A Quick Game and onward
    backBtn.style.display = pageCount > 0 ? "inline-block" : "none";
    nextBtn.style.display = pageCount < headings.length - 1 ? "inline-block" : "none";
    nextBtn.innerHTML = pageCount > 0 ? "Next &rarr;" : "Start Learning!";
    sandboxBtn.style.display = pageCount == 0 ? "inline-block" : "none";
    gameCanvas.style.display = dropItemSelect.style.display = pageCount == dropSection ? "block" : "none";
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
        sandboxBtn.textContent = "Go Back";
        nextBtn.style.display = "none";
        simulation.style.display = "block";
        simulationButtons.style.display = "block";
        simCanvas.style.display = "block";
        overlayCanvas.style.display = "block";
    } else {
        updateLessonView();
        sandboxBtn.textContent = "Sandbox";
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
