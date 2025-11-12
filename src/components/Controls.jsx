export default function Controls({ audioRef, setAudioFile, mode, setMode }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobURL = URL.createObjectURL(file);
      setAudioFile(blobURL);
      audioRef.current.src = blobURL;
      audioRef.current.load();
    }
  };

  const modes = ["Bars", "Waveform"];

  return (
  <div className="w-[85%] max-w-4xl mx-auto bg-white/5 border border-white/10 
                  rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.08)] 
                  flex items-center justify-between gap-4 px-6 py-4 
                  backdrop-blur-md transition-all duration-300 hover:bg-white/10">
    
    {/* Upload Button */}
    <label
      className="cursor-pointer bg-white/10 hover:bg-white/20 text-white 
                 font-medium px-4 py-2 rounded-lg shadow-inner transition-all"
    >
      Upload Song
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>

    {/* Audio Player */}
    <audio
      ref={audioRef}
      controls
      className="flex-1 invert-[0.85] contrast-125 opacity-90 rounded-lg"
    />

    {/* Mode Selector */}
    <select
      value={mode}
      onChange={(e) => setMode(e.target.value)}
      className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
    >
      {modes.map((m) => (
        <option key={m}>{m}</option>
      ))}
    </select>
  </div>
);
}
