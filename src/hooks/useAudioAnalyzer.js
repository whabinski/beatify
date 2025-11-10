import { useEffect, useRef } from "react";

export default function useAudioAnalyzer(audioRef, audioFile) {
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bufferLengthRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !audioFile) return;

    // Close old context
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    // Connect graph
    const source = audioCtx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Prepare buffers
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    bufferLengthRef.current = bufferLength;
    audioCtxRef.current = audioCtx;

    // Resume context on user interaction (Chrome autoplay rule)
    const resume = () => {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    };
    window.addEventListener("click", resume);
    window.addEventListener("keydown", resume);

    return () => {
      window.removeEventListener("click", resume);
      window.removeEventListener("keydown", resume);
      audioCtx.close();
    };
  }, [audioFile]);

  return { analyserRef, dataArrayRef, bufferLengthRef };
}
