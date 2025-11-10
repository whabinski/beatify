export default function Header({ mode, setMode }) {
  const modes = ["Bars", "Waveform", "Particles"];

  return (
    <header
      style={{
        textAlign: "center",
        marginBottom: "1.5rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        🎵 Music Visualizer
      </h1>

      {setMode && (
        <div>
          <label style={{ marginRight: "0.5rem" }}>Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ padding: "0.3rem 0.6rem", borderRadius: "4px" }}
          >
            {modes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
}
