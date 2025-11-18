/**
 * VisualizerCanvas
 * ---------------------------------------------------------
 * This component renders the <canvas> element and performs all
 * real-time drawing for the visualizer.
 *
 *   Resize the canvas dynamically based on screen size + DPR
 *   Pull frequency/time-domain data from the analyser node
 *   Call the correct visualizer mode renderer (Bars, Wave, Radial)
 *   Manage the animation loop efficiently with requestAnimationFrame
 *   Clean up listeners and animations on mode/audio change
 */

import { useEffect, useRef } from "react";
import useAudioAnalyzer from "../hooks/useAudioAnalyzer";
import drawBars from "./modes/BarsVisualizer";
import drawWaveform from "./modes/WaveVisualizer";
import drawRadial from "./modes/RadialVisualizer";

export default function VisualizerCanvas({
  audioRef,
  audioFile,
  mode,
  useMic,
}) {
  // The <canvas> DOM element
  const canvasRef = useRef(null);

  // Audio analysis data provided by hook
  const { analyserRef, dataArrayRef, bufferLengthRef } =
    useAudioAnalyzer(audioRef, audioFile, useMic);

  /**
   * -------------------------------------------------------
   * MAIN DRAWING and RESIZING EFFECT
   * Runs every time the audio source or mode changes.
   * -------------------------------------------------------
   */
  useEffect(() => {
    // If analyzer hasn't initialized yet, do nothing
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    //Recalculate canvas resolution
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Actual pixel resolution
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Reset drawing transforms to match DPR scaling
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Perform an initial layout-resize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Analyser and data buffers
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = bufferLengthRef.current;

    // For smoothing radial bars
    const smoothed = new Array(bufferLength).fill(0);

    /**
     * Draw loop — runs every frame (~60 FPS)
     */
    const draw = () => {
      animationId = requestAnimationFrame(draw);

      // Frequency domain data (0–255)
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas (black background)
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Different visualization modes
      if (mode === "Wave") {
        // Time-domain waveform instead of frequency data
        analyser.getByteTimeDomainData(dataArray);
        drawWaveform(ctx, canvas, dataArray);
      } else if (mode === "Radial") {
        drawRadial(ctx, canvas, dataArray, smoothed);
      } else {
        drawBars(ctx, canvas, dataArray, smoothed);
      }
    };

    // Start animation loop
    draw();

    /**
     * Cleanup:
     *  - Cancel the animation frame loop
     *  - Remove resize listener
     *  - Clear the canvas to avoid flicker on unmount
     */
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [audioFile, mode, useMic]);

  /**
   * Canvas wrapper stretches and centers the canvas
   * (width/height controlled entirely by parent container)
   */
  return (
    <div className="w-full h-full flex items-center justify-center min-w-0 min-h-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full
                  bg-transparent shadow-none outline-none rounded-none"
      />
    </div>
  );
}
