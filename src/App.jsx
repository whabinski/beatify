/**
 * App.jsx
 *
 * The root component of the Beatify application.
 * It manages global state (selected audio file, visualization mode, and mic input),
 * and arranges the page layout: Header, Visualization Canvas, and Controls.
 * The layout adapts dynamically to screen resizing with mobile and desktop styles.
 */

import { useState, useRef } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import VisualizerCanvas from "./components/VisualizerCanvas";

export default function App() {
  // Currently loaded audio source (file or trial track)
  const [audioFile, setAudioFile] = useState(null);

  // Selected visualizer mode
  const [mode, setMode] = useState("Bars");

  // Whether microphone input is active
  const [useMic, setUseMic] = useState(false);

  // Reference to the <audio> element shared across components
  const audioRef = useRef(null);

  return (
    <div
      className="
        h-[100dvh] w-full overflow-hidden
        bg-black text-white font-sans
      "
    >
      {/* Full-height vertical layout */}
      <div className="h-full w-full flex flex-col px-3 sm:px-6">

        {/* ---------- HEADER ---------- */}
        <div className="flex-none pt-safe pb-4">
          <Header />
        </div>

        {/* ---------- VISUALIZATION CANVAS ---------- */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="w-full md:w-[70%] h-full mx-auto flex">
            <VisualizerCanvas
              audioRef={audioRef}
              audioFile={audioFile}
              mode={mode}
              useMic={useMic}
            />
          </div>
        </div>

        {/* ---------- CONTROLS (bottom) ---------- */}
        <div className="flex-none pb-safe pt-3 mb-2 md:mb-8">
          <div className="w-full md:w-[70%] mx-auto">
            <Controls
              audioRef={audioRef}
              setAudioFile={setAudioFile}
              mode={mode}
              setMode={setMode}
              useMic={useMic}
              setUseMic={setUseMic}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
