export default function drawWaveform(ctx, canvas, dataArray) {
  const midY = canvas.clientHeight / 2;
  const numPoints = dataArray.length;
  const sliceWidth = canvas.clientWidth / (numPoints - 1);

  // Fading trail
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Color gradient
  const hueShift = (Date.now() / 40) % 360;
  const gradient = ctx.createLinearGradient(0, 0, canvas.clientWidth, 0);
  gradient.addColorStop(0, `hsl(${hueShift}, 100%, 70%)`);
  gradient.addColorStop(0.5, `hsl(${(hueShift + 120) % 360}, 100%, 70%)`);
  gradient.addColorStop(1, `hsl(${(hueShift + 240) % 360}, 100%, 70%)`);

  const amplitude = 2.0;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = gradient;
  ctx.shadowBlur = 15;
  ctx.shadowColor = `hsl(${(hueShift + 200) % 360}, 100%, 60%)`;

  const taper = 0.05; // taper first/last 5% of points
  const taperLength = Math.floor(numPoints * taper);

  const drawWave = (invert = 1, opacity = 1.0) => {
    ctx.beginPath();
    ctx.globalAlpha = opacity;

    for (let i = 0; i < numPoints; i++) {
      const v = dataArray[i] / 128.0;
      let amp = (v - 1) * (canvas.clientHeight * amplitude) / 2;

      // Apply smooth taper to start and end
      if (i < taperLength) amp *= i / taperLength;
      else if (i > numPoints - taperLength)
        amp *= (numPoints - i) / taperLength;

      const y = midY + invert * amp;
      const x = i * sliceWidth;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  };

  drawWave(1, 1.0);
  drawWave(-1, 0.8);

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}
