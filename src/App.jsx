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
      {/* Full-height column */}
      <div className="h-full w-full flex flex-col px-3 sm:px-6">
        {/* Header at top */}
        <div className="flex-none pt-safe pb-4">
          <Header />
        </div>

        {/* Visualizer fills middle area, but width is constrained on desktop */}
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

        {/* Controls at bottom, same width constraint on desktop */}
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
