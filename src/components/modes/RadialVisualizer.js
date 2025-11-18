/**
 * drawRadial
 * ------------------------------------------------------------
 * Renders a circular (radial) audio visualizer using frequency data.
 * The visualization is redrawn every animation frame by the parent component.
 */

// A global offset used to slowly rotate the entire visualizer
let rotationOffset = 0;

export default function drawRadial(ctx, canvas, dataArray, smoothed) {
  // ------------------------------------------------------------
  // Canvas dimensions
  // ------------------------------------------------------------
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const dpr = window.devicePixelRatio || 1;

  // Rescale device pixel resolution
  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const numBars = dataArray.length;
  const centerX = width / 2;
  const centerY = height / 2;

  // Radius of the inner circle the bars radiate from
  const radius = Math.min(centerX, centerY) * 0.15;

  // Maximum physical bar extension before hitting edges
  const maxBarLength = Math.min(centerX, centerY) - radius - 10;

  // ------------------------------------------------------------
  // Motion-trail background fade
  // Gives smooth trailing motion
  // ------------------------------------------------------------
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(0, 0, width, height);

  // ------------------------------------------------------------
  // Color and rotation animation parameters
  // ------------------------------------------------------------
  const time = Date.now() * 0.001;
  const hueShift = (time * 20) % 360; // slow color rotation
  rotationOffset += 0.002;            // constant global rotation speed

  // Angle between each bar in radians (full 360° / # bars)
  const angleStep = (Math.PI * 2) / numBars;

  // Average amplitude (0–255 normalized)
  const avgAmp = dataArray.reduce((a, b) => a + b, 0) / (255 * numBars);

  // Small breathing effect based on overall amplitude
  const pulse = 1 + avgAmp * 0.25;

  // ------------------------------------------------------------
  // Begin drawing from the center
  // ------------------------------------------------------------
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotationOffset);

  // ------------------------------------------------------------
  // Draw each radial bar
  // ------------------------------------------------------------
  for (let i = 0; i < numBars; i++) {
    // Smooth the data to prevent flicker:
    // smoothed[i] += (current - smoothed) * smoothingFactor
    smoothed[i] += (dataArray[i] - smoothed[i]) * 0.25;

    // Raw amplitude scaling
    let barHeight = smoothed[i] * 1.8 * pulse;

    // ------------------------------------------------------------
    // Nonlinear compression
    // Reduces harsh spikes and keeps visual nicely shaped
    // ------------------------------------------------------------
    barHeight = Math.pow(barHeight / maxBarLength, 0.8) * maxBarLength;

    const norm = barHeight / maxBarLength;
    if (norm > 1) {
      // Soft cap beyond limit (smooth logarithmic compression)
      const compression = 1 - Math.exp(-1.2 * (norm - 1));
      barHeight = maxBarLength * (1 + compression * 0.25);
    }

    // Per-bar hue shift to create rainbow sweep
    const hue = ((i / numBars) * 360 + hueShift) % 360;

    ctx.save();

    // Rotate canvas so each bar occupies the correct angular position
    ctx.rotate(i * angleStep);

    // Visual glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;

    // Actual bar color
    ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;

    // Bar geometry
    const barWidth = 2.4;
    const start = radius;
    const end = radius + barHeight * 0.85;

    // Draw one radial rectangle extending outward
    ctx.fillRect(start, -barWidth / 2, end - start, barWidth);

    ctx.restore();
  }

  ctx.restore();

  // Reset effects
  ctx.shadowBlur = 0;
}
