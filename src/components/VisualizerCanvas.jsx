import { useEffect, useRef } from "react";
import useAudioAnalyzer from "../hooks/useAudioAnalyzer";

export default function VisualizerCanvas({ audioRef, audioFile, mode }) {
  const canvasRef = useRef(null);
  const { analyserRef, dataArrayRef, bufferLengthRef } = useAudioAnalyzer(audioRef, audioFile);

  useEffect(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = bufferLengthRef.current;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const barWidth = (canvasRef.current.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, canvasRef.current.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
  }, [audioFile]);

  return <canvas ref={canvasRef} width={800} height={400} className="mt-6 rounded" />;
}
