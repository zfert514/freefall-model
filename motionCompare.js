// motionCompare.js — Visual comparison of constant vs accelerating fall

const MotionCompare = (() => {
  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Resize to match display size
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const objectSize = 20;
    const g = 9.8; // gravity in m/s²
    const pxPerMeter = 30;
    const constantSpeed = 6.7 * pxPerMeter; // 6.7 m/s in px

    const startX1 = canvas.width * 0.3;
    const startX2 = canvas.width * 0.6;
    const startY = 10;

    let startTime = null;

    canvas.addEventListener("click", () => {
      startTime = null; // restart animation
      requestAnimationFrame(frame);
    });

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;

      const yUniform = startY + constantSpeed * t;
      const yGravity = startY + 0.5 * g * t * t * pxPerMeter;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "blue";
      ctx.fillRect(startX1, yUniform, objectSize, objectSize);

      ctx.fillStyle = "red";
      ctx.fillRect(startX2, yGravity, objectSize, objectSize);

      if (yGravity < canvas.height - objectSize && yUniform < canvas.height - objectSize) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  return { init };
})();
