import { useState, useRef } from "react";
import Header from "./components/Header";
import Controls from "./components/Controls";
import VisualizerCanvas from "./components/VisualizerCanvas";

export default function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [mode, setMode] = useState("Bars");  // 👈 new line
  const audioRef = useRef(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Header mode={mode} setMode={setMode} /> {/* 👈 add props */}
      <Controls audioRef={audioRef} setAudioFile={setAudioFile} />
      <VisualizerCanvas
        audioRef={audioRef}
        audioFile={audioFile}
        mode={mode}  // 👈 pass down
      />
    </div>
  );
}
