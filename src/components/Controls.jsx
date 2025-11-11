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
    <div className="max-w-3xl mx-auto bg-gray-900/80 border border-gray-800 
                    rounded-lg shadow-[0_0_25px_rgba(99,102,241,0.35)] 
                    flex items-center justify-between px-6 py-4 backdrop-blur-sm gap-4">
      
      {/* Upload Button */}
      <label
        className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white 
                   font-semibold px-4 py-2 rounded-md shadow-md transition whitespace-nowrap"
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
        className="flex-1"
      />

      {/* Mode Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-400 uppercase tracking-widest">
          Mode
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-gray-800/80 text-white px-3 py-2 rounded-md border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          {modes.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
