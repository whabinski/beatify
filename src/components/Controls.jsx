export default function Controls({ audioRef, setAudioFile }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blobURL = URL.createObjectURL(file);
      setAudioFile(blobURL);
      if (audioRef.current) {
        audioRef.current.src = blobURL;      // ✅ set src directly
        audioRef.current.load();             // ✅ reload element
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <audio ref={audioRef} controls />
    </div>
  );
}
