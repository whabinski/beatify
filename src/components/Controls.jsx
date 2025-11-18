import { useEffect, useState } from "react";

export default function Controls({
  audioRef,
  setAudioFile,
  mode,
  setMode,
  useMic,
  setUseMic,
}) {
  const [selectedTrial, setSelectedTrial] = useState("");

  const base = import.meta.env.BASE_URL;

  const trialSongs = [
    { name: "Mr Smith", file: `${base}music/Mr Smith - Hip Shot.mp3` },
    { name: "Oneosune", file: `${base}music/Oneosune - Ancient Ruins.mp3` },
    { name: "VADE", file: `${base}music/VADE - Chinatown.mp3` },
  ];

  const controlWrapper = "h-[2.6rem] sm:h-[2.8rem] flex items-center";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const blobURL = URL.createObjectURL(file);
    setAudioFile(blobURL);

    if (audioRef.current) {
      audioRef.current.src = blobURL;
      audioRef.current.load();
    }

    setUseMic(false);
    setSelectedTrial("");
  };

  const handleTrialSelect = (value) => {
    setSelectedTrial(value);
    if (!value) return;

    setUseMic(false);

    if (audioRef.current) {
      audioRef.current.src = value;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }

    setAudioFile(value);
  };

  const modes = ["Bars", "Wave", "Radial"];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  return (
    <div
      className="w-full mx-auto bg-white/5 border border-white/10 
                 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.08)] 
                 flex flex-col md:flex-row flex-wrap md:items-center 
                 gap-3 md:gap-4 px-3 sm:px-5 py-3 sm:py-4 
                 backdrop-blur-md transition-all duration-300 
                 hover:bg-white/10 text-xs sm:text-sm min-w-0"
    >
      {/* Upload Button */}
      <label
        className={`${controlWrapper} cursor-pointer bg-white/10 hover:bg-white/20 text-white 
                    font-medium px-3 rounded-lg shadow-inner 
                    transition-all text-xs sm:text-sm`}
      >
        <span>Upload Song</span>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Trial Music Dropdown */}
      <div className={`${controlWrapper} md:flex-1 min-w-[6rem]`}>
        <select
          value={selectedTrial}
          onChange={(e) => handleTrialSelect(e.target.value)}
          className="w-full h-full bg-blue-500/70 hover:bg-blue-500 text-white px-3 
                     rounded-lg border border-blue-400/40 
                     focus:outline-none focus:ring-2 focus:ring-blue-300 
                     transition-all text-xs sm:text-sm"
        >
          <option value="">Trial music</option>
          {trialSongs.map((song) => (
            <option
              key={song.file}
              value={song.file}
              className="text-black bg-white"
            >
              {song.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mic Button */}
      <button
        onClick={() => {
          setUseMic((prev) => !prev);
          if (audioRef.current) audioRef.current.pause();
          setSelectedTrial("");
        }}
        className={`${controlWrapper} px-3 rounded-lg font-medium transition-all
                    text-xs sm:text-sm min-w-[6rem]
          ${
            useMic
              ? "bg-red-500/70 hover:bg-red-500 text-white"
              : "bg-green-500/60 hover:bg-green-500 text-white"
          }`}
      >
        {useMic ? "Stop Mic" : "Use Mic"}
      </button>

      {/* Audio Player */}
      <audio
        ref={audioRef}
        controls
        className="w-full md:flex-1 invert-[0.85] contrast-125 opacity-90 
                   rounded-lg scale-[0.98] md:scale-100 
                   transition-all duration-300 min-w-0"
      />

      {/* Mode Selector */}
      <div className={`${controlWrapper} min-w-[6rem]`}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full h-full bg-white/10 text-white px-3 
                     rounded-lg border border-white/20 
                     focus:outline-none focus:ring-2 focus:ring-white/40 
                     transition-all text-xs sm:text-sm"
        >
          {modes.map((m) => (
            <option key={m} className="text-black bg-white">
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
