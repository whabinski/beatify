import { useState, useRef } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import VisualizerCanvas from "./components/VisualizerCanvas";

export default function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [mode, setMode] = useState("Bars");
  const [useMic, setUseMic] = useState(false);
  const audioRef = useRef(null);

  return (
    <div
      className="h-[100dvh] w-full overflow-hidden
                 bg-black text-white font-sans"
    >
      {/* Full-width, full-height column */}
      <div className="h-full w-full flex flex-col px-4 sm:px-6">
        {/* Header at top */}
        <div className="flex-none pt-safe pb-4">
          <Header />
        </div>

        {/* Visualizer fills middle area */}
        <div className="flex-1 flex items-center justify-center">
          <VisualizerCanvas
            audioRef={audioRef}
            audioFile={audioFile}
            mode={mode}
            useMic={useMic}
          />
        </div>

        {/* Controls pinned to bottom with a bit of extra space on desktop */}
        <div className="flex-none pb-safe pt-3 mb-2 md:mb-8">
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
  );
}
