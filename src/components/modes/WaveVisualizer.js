/**
 * drawWaveform
 * ------------------------------------------------------------
 * Renders an audio waveform visualization.
 * Drawn using time-domain audio data.
 */

export default function drawWaveform(ctx, canvas, dataArray) {
  // Vertical center of the canvas
  const midY = canvas.clientHeight / 2;

  // Number of audio samples being visualized
  const numPoints = dataArray.length;

  // Horizontal spacing between each sample
  const sliceWidth = canvas.clientWidth / (numPoints - 1);

  // ------------------------------------------------------------
  // Background fading trail
  // Creates a smooth motion effect instead of full clear
  // ------------------------------------------------------------
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ------------------------------------------------------------
  // Animated gradient color (shifts hue over time)
  // ------------------------------------------------------------
  const hueShift = (Date.now() / 40) % 360; // slow cycling
  const gradient = ctx.createLinearGradient(0, 0, canvas.clientWidth, 0);

  gradient.addColorStop(0,   `hsl(${hueShift}, 100%, 70%)`);
  gradient.addColorStop(0.5, `hsl(${(hueShift + 120) % 360}, 100%, 70%)`);
  gradient.addColorStop(1,   `hsl(${(hueShift + 240) % 360}, 100%, 70%)`);

  // Visual styling for waveform
  const amplitude = 2.0;      // overall wave intensity multiplier
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = gradient;
  ctx.shadowBlur = 15;
  ctx.shadowColor = `hsl(${(hueShift + 200) % 360}, 100%, 60%)`;

  const taper = 0.05; // 5% taper on each side
  const taperLength = Math.floor(numPoints * taper);

  /**
   * Draw a single waveform line
   */
  const drawWave = (invert = 1, opacity = 1.0) => {
    ctx.beginPath();
    ctx.globalAlpha = opacity;

    for (let i = 0; i < numPoints; i++) {
      // Convert audio sample (0–255) to centered waveform (-1 to 1)
      const v = dataArray[i] / 128.0;

      // Scaled amplitude
      let amp =
        ((v - 1) * (canvas.clientHeight * amplitude)) / 2;

      // Apply taper at beginning
      if (i < taperLength) {
        amp *= i / taperLength;
      }
      // Apply taper at end
      else if (i > numPoints - taperLength) {
        amp *= (numPoints - i) / taperLength;
      }

      // Final pixel position
      const y = midY + invert * amp;
      const x = i * sliceWidth;

      // Move on first sample, lineTo for the rest
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  };

  // ------------------------------------------------------------
  // Dual-wave system:
  // ------------------------------------------------------------
  drawWave(1, 1.0);   // draw top wave
  drawWave(-1, 0.8);  // draw mirrored lower wave

  // Reset drawing state
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}
