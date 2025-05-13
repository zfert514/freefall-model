/* ==============================================================================================
   FALLING APPLE ANIMATION
   ============================================================================================== */
let appleCanvas, appleImg, apple, lastTime;

// AppleCanvas and ctx need to wait until DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    appleCanvas = document.getElementById("appleCanvas");
    appleCtx = appleCanvas.getContext("2d");
    appleImg = new Image();
    appleImg.src = "img/svg/apple_1.svg";

    apple = null;
    lastTime = 0;

    resizeCanvas();

    function resizeCanvas() {
        appleCanvas.width = appleCanvas.offsetWidth;
        appleCanvas.height = appleCanvas.offsetHeight;
    }

    function spawnApple() {
        const x = Math.random() * appleCanvas.width;
        apple = {
            x,
            y: -50,
            vx: 0,
            vy: 0,
            rotation: 0,
            bounced: false,
            trail: []
        };
    }

    function updateApple(dt) {
        if (!apple) return;

        // Apply gravity
        apple.vy += 0.002 * dt;
        apple.y += apple.vy * dt;
        apple.rotation += 0.002 * dt;

        // Store trail
        apple.trail.push({ x: apple.x, y: apple.y, opacity: 1.0 });
        if (apple.trail.length > 10) apple.trail.shift();
        apple.trail.forEach((dot, i) => {
            dot.opacity = 1 - i / apple.trail.length;
        });

        // Bounce
        const ground = appleCanvas.height - 40;
        if (apple.y >= ground && !apple.bounced) {
            apple.vy = -0.4 * Math.sqrt(apple.vy);
            apple.bounced = true;
        } else if (apple.y > appleCanvas.height + 50) {
            apple = null;
            setTimeout(spawnApple, 1000);
        }
    }

    function drawApple() {
        if (!apple) return;

        // Draw trail
        for (let t of apple.trail) {
            appleCtx.globalAlpha = t.opacity * 0.5;
            appleCtx.drawImage(appleImg, t.x - 20, t.y - 20, 40, 40);
        }

        // Draw apple
        appleCtx.save();
        appleCtx.translate(apple.x, apple.y);
        appleCtx.rotate(apple.rotation);
        appleCtx.globalAlpha = 1;
        appleCtx.drawImage(appleImg, -20, -20, 40, 40);
        appleCtx.restore();
    }

    function animateBannerApple(timestamp) {
        const dt = timestamp - lastTime;
        lastTime = timestamp;

        appleCtx.clearRect(0, 0, appleCanvas.width, appleCanvas.height);

        updateApple(dt);
        drawApple();

        requestAnimationFrame(animateBannerApple);
    }

    appleImg.onload = () => {
        spawnApple();
        requestAnimationFrame(animateBannerApple);
    };
});
