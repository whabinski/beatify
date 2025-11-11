import { useEffect, useRef } from "react";
import useAudioAnalyzer from "../hooks/useAudioAnalyzer";

export default function VisualizerCanvas({ audioRef, audioFile, mode }) {
  const canvasRef = useRef(null);
  const { analyserRef, dataArrayRef, bufferLengthRef } =
    useAudioAnalyzer(audioRef, audioFile);

  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    // Match the internal canvas resolution to its CSS size
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = bufferLengthRef.current;

    // for smoother bar motion
    const smoothed = new Array(bufferLength).fill(0);

    const draw = () => {
      requestAnimationFrame(draw);

      if (mode === "Waveform") {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        analyser.getByteFrequencyData(dataArray);
      }

      // soft fade background to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (mode === "Waveform") {
        // 🌊 waveform mode
        ctx.lineWidth = 2;
        ctx.strokeStyle = "hsl(240, 100%, 70%)";
        ctx.beginPath();

        const sliceWidth = canvasRef.current.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0; // normalize around 128 midpoint
          const y = (v * canvasRef.current.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }

        ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
        ctx.stroke();
      } else {
        // 🎵 bar mode
        const barWidth = (canvasRef.current.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          smoothed[i] += (dataArray[i] - smoothed[i]) * 0.2; // smooth motion
          const barHeight = smoothed[i];
          const hue = (i / bufferLength) * 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(
            x,
            canvasRef.current.height - barHeight,
            barWidth,
            barHeight
          );
          x += barWidth + 1;
        }
      }
    };

    draw();
  }, [audioFile, mode]);

  return (
  <div className="w-full flex justify-center mt-10">
    <canvas
      ref={canvasRef}
      className="w-[90%] max-w-5xl aspect-[2.5/1.4] 
                 rounded-lg border border-gray-800 
                 bg-black/70 shadow-[0_0_50px_rgba(99,102,241,0.5)] 
                 backdrop-blur-sm transition-all duration-300"
    />
  </div>
);
}
