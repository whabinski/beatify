import { useState, useRef } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import VisualizerCanvas from "./components/VisualizerCanvas";

export default function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [mode, setMode] = useState("Bars");
  const audioRef = useRef(null);

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center 
                 bg-black text-white font-sans selection:bg-indigo-500 selection:text-white 
                 overflow-hidden"
    >
      {/* Wrapper for proportional vertical layout */}
      <div className="w-full max-w-6xl flex flex-col items-center justify-between h-[90vh] px-6 text-center">
        {/* Title slightly lowered */}
        <div className="flex-none mt-[1vh]">
          <Header />
        </div>

        {/* Visualization centered dynamically */}
        <div className="flex-grow flex items-center justify-center">
          <VisualizerCanvas
            audioRef={audioRef}
            audioFile={audioFile}
            mode={mode}
          />
        </div>

        {/* Controls near bottom, floating */}
        <div className="flex-none mb-[2vh] w-full flex justify-center">
          <Controls
            audioRef={audioRef}
            setAudioFile={setAudioFile}
            mode={mode}
            setMode={setMode}
          />
        </div>
      </div>
    </div>
  );
}
