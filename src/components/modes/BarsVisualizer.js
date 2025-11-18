/**
 * drawBars
 * ------------------------------------------------------------
 * Renders a vertical bar audio visualizer.
 * Called every animation frame by VisualizerCanvas.
 */

export default function drawBars(ctx, canvas, dataArray, smoothed) {
  // Total number of bars = number of frequency buckets
  const numBars = dataArray.length;

  // ------------------------------------------------------------
  // Bar width calculations
  // ------------------------------------------------------------
  const barWidth = (canvas.clientWidth / numBars) * 1.15; // slightly widen bars
  const gap = 0.5;                                        // tiny gap between bars
  const effectiveBarWidth = barWidth - gap;

  // Convert 0–255 amplitude to canvas height
  const scale = canvas.clientHeight / 255;

  // ------------------------------------------------------------
  // Draw each bar
  // ------------------------------------------------------------
  for (let i = 0; i < numBars; i++) {
    // Smoothing prevents rapid jitter
    // smoothed += (current - smoothed) * factor
    smoothed[i] += (dataArray[i] - smoothed[i]) * 0.2;

    // Vertical bar height in pixels
    const barHeight = smoothed[i] * scale;

    // Hue shifts smoothly across spectrum from 0 → 360°
    const hue = (i / numBars) * 360;

    // Bar color (bright rainbow)
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

    // Glow effect increases with bar height
    ctx.shadowBlur = Math.min(barHeight / 3, 30);
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;

    // Horizontal position of this bar
    const x = i * barWidth;

    // Draw vertical bar extending upward from the bottom of the canvas
    ctx.fillRect(
      x,
      canvas.clientHeight - barHeight, // bar origin
      effectiveBarWidth,               // bar width after gap
      barHeight                        // height
    );
  }

  // Reset shadow
  ctx.shadowBlur = 0;
}
