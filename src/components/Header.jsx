export default function Header() {
  return (
    <header className="flex flex-col items-center text-center space-y-2 sm:space-y-3 select-none">
      <h1
        className="flex items-center gap-2 font-extrabold tracking-tight
                   bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                   bg-clip-text text-transparent animate-glow
                   text-3xl sm:text-5xl lg:text-6xl"
      >
        <span className="text-2xl sm:text-3xl">🎶</span>
        Beatify
      </h1>

      <p className="text-gray-400 text-xs sm:text-sm md:text-base tracking-wide">
        Feel the rhythm. See the sound.
      </p>
    </header>
  );
}
