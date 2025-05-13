/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */
// Script
let headings = [
    "What Goes Up...",
    "A Quick Game",
    "Try It Yourself",
    "Is Gravity Pulling Constantly?",
    "Air Makes Things Interesting",
    "What About Buoyancy?",
    "You Discovered the Science of Falling"
];
const scripts = [
    "Hi there! I'm Sir Isaac Newton 🧑‍🏫, and this is my friend Apple 🍎. We're here to help you understand something amazing: why things fall!",
    "When we drop something, we know it falls to the ground. But have you ever stopped to wonder *why*? Maybe you've heard the word \"gravity.\" Let's learn a little more about how that works.",
    "Let's try something. I'm going to drop my friend Mr. Apple and you choose one of the items below to drop. Try to choose something that will fall faster than Mr. Apple.",
    "Use the simulation below. You can: • Drag Apple to change the starting height • Press 'Start' to see how it falls. What do you notice?",
    "Now watch two objects fall: • One falls at a constant speed • One falls like a real object. Which one looks more like real life? The real one speeds up as it falls. That’s acceleration!",
    'Try switching the atmosphere from "Vacuum" to "Air." You’ll see lighter things fall more slowly. That’s air resistance—air pushing back on things that fall.',
    "Buoyancy is what makes things float—like a balloon in air or a duck in a tub. Try placing a low-density object in the simulation—it might float! Now try a heavier one. See how density and buoyancy affect motion.",
    "Gravity pulls. Air resists. Buoyancy pushes. You’ve learned why rocks fall, feathers float, and balloons rise. Great job!"
];

const instructions = ["Drag the ball up or down to set the height, then press play to simulate.", ""];
const images = [
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg"
];

let nextBtn,
    header,
    introText,
    headingText,
    instructionText,
    dropItemSelect,
    isaacNewton,
    pageCount,
    simControls,
    densityControls,
    atmosphereControls;

/* ==============================================================================================

   ============================================================================================== */
// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
document.addEventListener("DOMContentLoaded", () => {
    nextBtn = document.getElementById("nextBtn");
    introText = document.getElementById("intro");
    headingText = document.getElementById("heading");
    instructionText = document.getElementById("instruction");
    dropItemSelect = document.getElementById("dropItemSelect");
    isaacNewton = document.getElementById("isaacNewton");
    simControls = document.getElementById("simControls");
    gravityLabel = document.getElementById("gravityLabel");
    atmosphereControls = document.getElementById("atmosphereControls");
    densityControls = document.getElementById("densityControls");
    pageCount = 0;

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            goToLessonSection(pageCount);
        });
    }
});

// Start simulation; if resume=true, use current velocity/position
// Starts or resumes the simulation depending on the 'resume' flag.
function nextSlide() {
    if (pageCount <= headings.length - 1) {
        headingText.textContent = headings[pageCount];
        introText.textContent = scripts[pageCount];
        instructionText.textContent = instructions[pageCount];
        isaacNewton.src = images[pageCount];
        if (pageCount == -1) {
            nextBtn.disabled = true;
            dropItemSelect.display = flex;
        }
        pageCount += 1;
    }
}

/* ==============================================================================================
   FUNCTION: goToLessonSection
   Controls UI visibility and feature access depending on which lesson section is active
   ============================================================================================== */
function goToLessonSection() {
    // Hide all optional controls by default
    gravityLabel.style.display = "none";
    if (densityControls) densityControls.style.display = "none";

    // Unlock controls based on current lesson section
    if (pageCount >= 3) simControls.style.display = "block"; // Try It Yourself and onward
    if (pageCount >= 5) atmosphereControls.style.display = "block"; // Enable air toggle
    if (pageCount >= 6 && densityControls) densityControls.style.display = "block"; // Show buoyancy options
}

/* ==============================================================================================
   FUNCTION: attachEquationTooltips
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
