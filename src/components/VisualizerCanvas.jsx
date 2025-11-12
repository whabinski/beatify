import { useEffect, useRef } from "react";
import useAudioAnalyzer from "../hooks/useAudioAnalyzer";

export default function VisualizerCanvas({ audioRef, audioFile, mode }) {
  const canvasRef = useRef(null);
  const { analyserRef, dataArrayRef, bufferLengthRef } =
    useAudioAnalyzer(audioRef, audioFile);

  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = bufferLengthRef.current;

    const smoothed = new Array(bufferLength).fill(0);

    const draw = () => {
      requestAnimationFrame(draw);

      if (mode === "Waveform") {
        analyser.getByteTimeDomainData(dataArray);
      } else {
        analyser.getByteFrequencyData(dataArray);
      }

      // fully transparent background for seamless integration
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mode === "Waveform") {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "hsl(240, 100%, 70%)";
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else {
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          smoothed[i] += (dataArray[i] - smoothed[i]) * 0.2;
          const barHeight = smoothed[i];
          const hue = (i / bufferLength) * 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(
            x,
            canvas.height - barHeight,
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
    <div className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-6xl aspect-[2.4/1.3] bg-transparent border-none shadow-none outline-none rounded-none"
      />
    </div>
  );
}
