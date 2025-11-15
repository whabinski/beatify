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

  // 🎵 Trial tracks (put these in /public/music/...)
  const trialSongs = [
    { name: "Mr Smith", file: "/music/Mr Smith - Hip Shot.mp3" },
    { name: "Oneosune", file: "/music/Oneosune - Ancient Ruins.mp3" },
    { name: "VADE", file: "/music/VADE - Chinatown.mp3" },
  ];

  // Upload local file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !audioRef.current) return;

    const blobURL = URL.createObjectURL(file);
    setAudioFile(blobURL);             // tells analyzer about new source
    audioRef.current.src = blobURL;    // point audio element to file
    audioRef.current.load();

    setUseMic(false);                  // mic off when using a file
    setSelectedTrial("");              // clear trial selection
  };

  // Select one of the bundled trial tracks
  const handleTrialChange = (e) => {
    const file = e.target.value;
    setSelectedTrial(file);

    if (!file || !audioRef.current) return;

    setUseMic(false);                  // mic off
    setAudioFile(file);                // update analyzer
    audioRef.current.src = file;
    audioRef.current.load();
    audioRef.current
      .play()
      .catch(() => {
        // ignore autoplay errors (browser blocks without user gesture)
      });
  };

  const modes = ["Bars", "Wave", "Radial"];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, [audioRef]);

  return (
    <div
      className="w-[85vw] max-w-[80rem] mx-auto bg-white/5 border border-white/10 
                 rounded-[1.5vw] shadow-[0_0_2vw_rgba(255,255,255,0.08)] 
                 flex items-center justify-between gap-[1.5vw] 
                 px-[2vw] py-[1vw] backdrop-blur-md transition-all duration-300 
                 hover:bg-white/10 text-[1vw]"
    >
      {/* Upload Button */}
      <label
        className="cursor-pointer bg-white/10 hover:bg-white/20 text-white 
                   font-medium px-[1.2vw] py-[0.6vw] rounded-[0.6vw] 
                   shadow-inner transition-all text-[1vw]"
      >
        Upload
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Trial Music Dropdown */}
      <select
        value={selectedTrial}
        onChange={handleTrialChange}
        className="bg-blue-500/70 hover:bg-blue-500 text-white px-[1vw] py-[0.6vw] 
                   rounded-[0.6vw] border border-blue-400/40 
                   focus:outline-none focus:ring-[0.2vw] focus:ring-blue-300 
                   transition-all text-[1vw]"
      >
        <option value="">Trial</option>
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

      {/* Mic Button */}
      <button
        onClick={() => {
          const next = !useMic;
          setUseMic(next);
          if (next && audioRef.current) {
            // switching mic on: pause any playing file and clear trial selection
            audioRef.current.pause();
            setSelectedTrial("");
          }
        }}
        className={`px-[1.2vw] py-[0.6vw] rounded-[0.6vw] font-medium transition-all text-[1vw]
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
        className="flex-1 invert-[0.85] contrast-125 opacity-90 rounded-[0.6vw]
                   scale-[0.95] md:scale-100 transition-all duration-300"
      />

      {/* Mode Selector */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="bg-white/10 text-white px-[1vw] py-[0.5vw] 
                   rounded-[0.6vw] border border-white/20 
                   focus:outline-none focus:ring-[0.2vw] focus:ring-white/40 
                   transition-all text-[1vw]"
      >
        {modes.map((m) => (
          <option key={m} className="text-black bg-white">
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
