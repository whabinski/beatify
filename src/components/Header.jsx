export default function Header() {
  return (
    <header className="flex flex-col items-center space-y-4 mt-4 select-none">
      <h1
        className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r 
                   from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent
                   flex items-center gap-2 animate-glow"
      >
        <span className="text-4xl">🎶</span>
        Beatify
      </h1>

      <p className="text-gray-400 text-sm tracking-wide">
        Feel the rhythm. See the sound.
      </p>
    </header>
  );
}
