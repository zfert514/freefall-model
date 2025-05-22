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
const headings = [
    "",
    "Meet Newton",
    "What Goes Up...",
    "A Quick Game",
    "Landing Together",
    "Try It Yourself",
    "Is Gravity Pulling Constantly?",
    "Gravity & Acceleration",
    "Adjust Height & Gravity",
    "Ready for Water?",
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

    // 1) Meet Newton
    `Hi there! I'm Sir Isaac Newton <i>(but my friends just call me Newton)</i> and this is my friend Mr. Apple. 
  We're here to help you understand something amazing: how things fall!`,

    // 2) What Goes Up...
    `When we drop something, we know it falls to the ground. But have you ever stopped to wonder why? 
  Maybe you've heard something about <i>gravity</i>. Let's learn a little more about how that works.`,

    // 3) A Quick Game
    `Let's try something. I'm going to drop my friend Mr. Apple and you choose one of the items below to drop. 
  Try to choose something that will fall faster than Mr. Apple.`,

    // 4) Landing Together
    `Isn't that strange? It seems that no matter what items we drop, they hit the ground at the same time. 
  Let's investigate that a bit more.`,

    // 5) Try It Yourself
    `Use the simulation below. You can:<br>
   • Drag Apple to change the starting height  <br>
   • Press 'Start' to see how it falls.  <br>
  What do you notice?`,

    // 6) Is Gravity Pulling Constantly?
    `Let me now show you two other objects falling side by side:<br>
   • One falls at a constant speed  <br>
   • One speeds up as it falls  <br>
  Which one looks more like real life?`,

    // 7) Gravity & Acceleration
    `If you guessed the one that speeds up you are right!<br>
  Acceleration on Earth happens because gravity pulls all objects towards Earth's center at about 9.8 m/s². 
  No matter their mass, everything speeds downward at the same rate under gravity.`,

    // 8) Adjust Height & Gravity
    `Now let’s explore how initial height and gravity settings both change the fall. 
  Use the height slider and gravity control below, then press 'Start' to see how each one affects the motion.`,

    // 9) Ready for Water?
    `There’s still one element to falling that we haven’t explored yet. 
  Before we get into that, let me tell you a little about water.`,

    // 10) Water Displacement
    `When you drop something into water, it pushes water molecules out of its way—this is called displacement. 
  The displaced water pushes back on the object, slowing its fall more than air resistance alone.`,

    // 11) Interactive Water Displacement
    `Try this interactive: drop different objects into the water chamber below. 
  Watch how quickly each sinks and how water displacement changes their speed.`,

    // 12) What About Buoyancy?
    `Buoyancy is what makes things float—like a balloon in air or a duck in a tub. 
  Try placing a low-density object in the simulation—it might float! Now try a heavier one. 
  See how density and buoyancy affect motion.`,

    // 13) When Buoyancy Wins
    `If an object is less dense than the fluid it’s in, the buoyant force can exceed gravity, 
  causing it to rise instead of sink.`,

    // 14) Air as a Fluid
    `In the real world, air behaves like a light fluid. As an apple falls, it must push air molecules aside, 
  which slows its descent—just like water, but much less dense.`,

    // 15) Vacuum vs Air
    `Try switching the atmosphere from "Vacuum" to "Air."  
  You’ll see lighter things fall more slowly. That’s air resistance—air pushing back on things that fall.`,

    // 16) Terminal Velocity
    `If an object falls long enough, air resistance and gravity balance out so it stops accelerating. 
  That stable speed is called terminal velocity—the maximum speed it will reach as it falls.`,

    // 17) You Discovered the Science of Falling
    `Gravity pulls. Air resists. Buoyancy pushes.  
  You’ve learned why rocks fall, feathers float, and balloons rise. Great job!`
];

const instructions = [
    // 0) (start / sandbox choice)
    "Choose <b>Start Learning</b> to begin or <b>Sandbox</b> to explore freely.",

    // 1) Meet Newton
    "",

    // 2) What Goes Up...
    "",

    // 3) A Quick Game
    "Choose an item below and click it to drop alongside Mr. Apple.",

    // 4) Landing Together
    "",

    // 5) Try It Yourself
    "Drag the apple up or down to set the height, then press <b>Start</b> to simulate.",

    // 6) Is Gravity Pulling Constantly?
    "Click within the frame below to restart the animation.",

    // 7) Gravity & Acceleration
    "",

    // 8) Adjust Height & Gravity
    "Use the height slider and gravity control, then press <b>Start</b> to see both effects.",

    // 9) Ready for Water?
    "",

    // 10) Water Displacement
    "",

    // 11) Interactive Water Displacement
    "Select an object and drop it into the water tank below to watch displacement.",

    // 12) What About Buoyancy?
    "",

    // 13) When Buoyancy Wins
    "",

    // 14) Air as a Fluid
    "",

    // 15) Vacuum vs Air
    "Switch the atmosphere dropdown between <b>Vacuum</b> and <b>Air</b>.",

    // 16) Terminal Velocity
    "Press <b>Play</b> and let the object fall until it reaches its steady top speed.",

    // 17) You Discovered the Science of Falling
    ""
];

const images = [
    // 0) (start / sandbox choice)
    "img/svg/newton_chalkboard.svg",

    // 1) Meet Newton
    "img/svg/newton_apple_hi.svg",

    // 2) What Goes Up...
    "img/svg/newton_point.svg",

    // 3) A Quick Game
    "img/svg/newton_crossed.svg",

    // 4) Landing Together
    "img/svg/newton_landing.svg",

    // 5) Try It Yourself
    "img/svg/simulation_intro.svg",

    // 6) Is Gravity Pulling Constantly?
    "img/svg/newton_shrug.svg",

    // 7) Gravity & Acceleration
    "img/svg/constant_vs_accel.svg",

    // 8) Adjust Height & Gravity
    "img/svg/adjust_settings.svg",

    // 9) Ready for Water?
    "img/svg/ready_for_water.svg",

    // 10) Water Displacement
    "img/svg/water_displacement.svg",

    // 11) Interactive Water Displacement
    "img/svg/water_interactive.svg",

    // 12) What About Buoyancy?
    "img/svg/buoyancy_intro.svg",

    // 13) When Buoyancy Wins
    "img/svg/buoyancy_win.svg",

    // 14) Air as a Fluid
    "img/svg/air_fluid.svg",

    // 15) Vacuum vs Air
    "img/svg/vacuum_vs_air.svg",

    // 16) Terminal Velocity
    "img/svg/terminal_velocity.svg",

    // 17) You Discovered the Science of Falling
    "img/svg/newton_thumbs_up.svg"
];

let isSandbox = false; // Flag for sandbox
let pageCount = 0; // Keep track of lesson pages

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
    simulationButtons,
    compareCanvas;

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
    compareCanvas = document.getElementById("compareCanvas");

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

    //if (densityControls) densityControls.style.display = "none";

    // Change navigation controls based on page
    backBtn.style.display = pageCount > 0 ? "inline-block" : "none";
    nextBtn.style.display = pageCount < headings.length - 1 ? "inline-block" : "none";
    nextBtn.innerHTML = pageCount > 0 ? "Next &rarr;" : "Start Learning!";
    sandboxBtn.style.display = pageCount == 0 ? "inline-block" : "none";

    // Hide everything by default
    setDisplay([gameCanvas, dropItemSelect, simulationButtons, simCanvas, overlayCanvas, simControls], "none");
    compareCanvas.style.display = "none";

    // Handle page-specific display
    switch (pageCount) {
        case 3: // Quick Game
            setDisplay([gameCanvas, dropItemSelect, simulation], "block");
            break;

        case 5: // Try It Yourself
            setDisplay([simulationButtons, simCanvas], "block");
            break;

        case 6: // Constant vs Accelerated Fall
            compareCanvas.style.display = "block";
            MotionCompare.init("compareCanvas");
            break;

        case 8: // Final simulation page
            setDisplay([overlayCanvas, simControls, simulationButtons, simCanvas], "block");
            break;
    }

    //if (pageCount >= 7) atmosphereControls.style.display = "block"; // Enable air toggle
    //if (pageCount >= 8 && densityControls) densityControls.style.display = "block"; // Show buoyancy options
}

// Hides and unhides the simulation as necessary
function unlockSim() {
    isSandbox = !isSandbox;
    if (isSandbox) {
        headingText.innerHTML = "Sandbox";
        introText.innerHTML = "";
        instructionText.innerHTML = "Try out the full Freefall Simulator!";
        isaacNewton.src = "img/svg/newton_desk.svg";
        sandboxBtn.textContent = "Go Back";
        setDisplay([simControls, simulation, atmosphereControls, simulationButtons, simCanvas, overlayCanvas], "block");
        nextBtn.style.display = "none";
    } else {
        updateLessonView();
        sandboxBtn.textContent = "Sandbox";
    }
}

function setDisplay(elements, value) {
    elements.forEach((el) => {
        if (el) el.style.display = value;
    });
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
