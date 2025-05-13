/* ==============================================================================================
   GLOBAL VARIABLES & SETTINGS
   ============================================================================================== */
// Script
let headings = ["What Goes Up...", "A Quick Game"];
const scripts = [
    "When we drop something, we know it falls to the ground. But have you ever stopped to wonder why? Maybe you've heard of \"gravity\", the force that keeps us on the ground. Let's learn a little more about how that works.",
    "Let's try something. I'm going to drop my friend Mr. Apple and you choose one of the items below to drop. Try to choose something that will fall faster than Mr. Apple."
];
const instructions = ["Drag the ball up or down to set the height, then press play to simulate.", ""];
const images = [
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg",
    "img/svg/newton_point.svg"
];

let nextBtn, header, introText, headingText, instructionText, dropItemSelect, isaacNewton, pageCount;

/* ==============================================================================================
   PAGE LOAD
   ============================================================================================== */
// Initialize ball position
// On page load: draw the red ball and update the initial height readout.
document.addEventListener("DOMContentLoaded", () => {
    nextBtn = document.getElementById("nextBtn");
    introText = document.getElementById("intro");
    instruction = document.getElementById("instruction");
    dropItemSelect = document.getElementById("dropItemSelect");
    isaacNewton = document.getElementById("isaacNewton");
    pageCount = 0;

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (heading) heading.textContent = headings[pageCount];
            if (intro) intro.textContent = scripts[pageCount];
            if (instruction) instruction.textContent = instructions[pageCount];
            if (isaacNewton) isaacNewton.src = images[pageCount];
            if (simulation && pageCount == 4) simulation.style.display = "block";
            if (nextBtn && pageCount == 1) nextBtn.disabled = true;
            if (dropItemSelect && pageCount == 1) dropItemSelect.style.display = "flex";
            pageCount += 1;
        });
    }
});
