import { useState, useRef } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import VisualizerCanvas from "./components/VisualizerCanvas";

export default function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [mode, setMode] = useState("Bars");
  const audioRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between 
                    bg-gradient-to-b from-slate-900 via-gray-900 to-black 
                    text-white font-sans selection:bg-indigo-500 selection:text-white 
                    py-8">
      <div className="w-full max-w-5xl px-6 py-10 text-center space-y-10">
        <Header/>
        <VisualizerCanvas 
          audioRef={audioRef} 
          audioFile={audioFile} 
          mode={mode} 
        />
        <Controls
          audioRef={audioRef}
          setAudioFile={setAudioFile}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
}
