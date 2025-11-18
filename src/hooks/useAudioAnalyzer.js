/**
 * useAudioAnalyzer
 * ---------------------------------------------------------
 * A custom hook that manages:
 *   - A single shared AudioContext for the entire app
 *   - A persistent AnalyserNode for visualizing audio
 *   - An audio <audio> element source (MediaElementSourceNode)
 *   - An optional microphone input source (MediaStreamSource)
 */

import { useEffect, useRef } from "react";

export default function useAudioAnalyzer(audioRef, audioFile, useMic = false) {
  // Persistent analyzer node
  const analyserRef = useRef(null);

  // Holds the time/frequency domain data arrays used by visualizers
  const dataArrayRef = useRef(null);
  const bufferLengthRef = useRef(null);

  // Shared AudioContext
  const audioCtxRef = useRef(null);

  // Audio sources
  const elementSourceRef = useRef(null); // <audio> element
  const micSourceRef = useRef(null);     // Microphone
  const micStreamRef = useRef(null);     // Raw MediaStream for stopping

  /**
   * ---------------------------------------------------------
   * 1) INITIAL SETUP: AudioContext + MediaElementSource + Analyser
   * Runs only when `audioRef` first becomes available.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    // Create or reuse AudioContext
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioCtx = audioCtxRef.current;

    // Create the <audio> element's source
    if (!elementSourceRef.current) {
      elementSourceRef.current = audioCtx.createMediaElementSource(audioEl);
    }

    // Create analyser
    if (!analyserRef.current) {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect <audio> element to analyser
      elementSourceRef.current.connect(analyser);

      // Connect <audio> element to speakers
      elementSourceRef.current.connect(audioCtx.destination);

      // Initialize output buffers for visualizers
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      bufferLengthRef.current = bufferLength;
      dataArrayRef.current = dataArray;
    }

    // Resume context on user interaction
    const resume = () => {
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
    };
    window.addEventListener("click", resume);
    window.addEventListener("keydown", resume);

    return () => {
      window.removeEventListener("click", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [audioRef]);

  /**
   * ---------------------------------------------------------
   * 2) Resumes AudioContext whenever a new file loads.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const audioCtx = audioCtxRef.current;

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  }, [audioFile]);

  /**
   * ---------------------------------------------------------
   * 3) Mic handling
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const audioCtx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!audioCtx || !analyser) return;

    let cancelled = false;

    /** Enable microphone */
    const enableMic = async () => {
      try {
        // Request permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // If effect cleaned up while waiting, stop immediately
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        micStreamRef.current = stream;

        // Convert raw stream to Web Audio node
        const micSource = audioCtx.createMediaStreamSource(stream);
        micSourceRef.current = micSource;

        micSource.connect(analyser);
      } catch (err) {
        console.error("Microphone access error:", err);
      }
    };

    if (useMic) {
      enableMic();
    } else {
      // Disable mic: disconnect source and stop stream
      if (micSourceRef.current) {
        try {
          micSourceRef.current.disconnect();
        } catch {}
        micSourceRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
    }

    // Cleanup if component unmounts or mic quickly toggles
    return () => {
      cancelled = true;

      if (useMic) {
        if (micSourceRef.current) {
          try {
            micSourceRef.current.disconnect();
          } catch {}
          micSourceRef.current = null;
        }
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((t) => t.stop());
          micStreamRef.current = null;
        }
      }
    };
  }, [useMic]);

  // Return analyser and buffers to visualization renderer
  return { analyserRef, dataArrayRef, bufferLengthRef };
}
