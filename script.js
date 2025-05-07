function buttonClicked() {
    const height = parseFloat(document.getElementById("height").value);
    const gravity = parseFloat(document.getElementById("gravity").value);
    const timeInput = parseFloat(document.getElementById("time").value);

    // Basic error checking
    if (height <= 0 || gravity <= 0) {
        alert("Please enter positive values for height and gravity.");
        return;
    }

    // Calculate time of fall if height and gravity are given
    const calculatedTime = Math.sqrt((2 * height) / gravity);

    // Calculate velocity at given time
    const velocity = gravity * timeInput;

    // Display the results
    let resultDiv = document.getElementById("resultDiv");
    if (!resultDiv) {
        resultDiv = document.createElement("div");
        resultDiv.id = "resultDiv";
        document.body.appendChild(resultDiv);
    }

    resultDiv.innerHTML = `
        <h3>Simulation Results</h3>
        <p>Calculated time to fall from ${height}m: <strong>${calculatedTime.toFixed(2)} s</strong></p>
        <p>Velocity at t=${timeInput}s: <strong>${velocity.toFixed(2)} m/s</strong></p>
    `;
}
