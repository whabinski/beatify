export default function Header() {
  return (
    <header className="flex flex-col items-center space-y-[1.5vh] mt-[2vh] select-none text-center">
      <h1
        className="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] 
                   font-extrabold tracking-tight bg-gradient-to-r 
                   from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent
                   flex items-center gap-[0.8vw] animate-glow leading-none"
      >
        <span className="text-[3.2vw] sm:text-[2.4vw]">🎶</span>
        Beatify
      </h1>

      <p className="text-gray-400 text-[1.3vw] sm:text-[1vw] md:text-[0.9vw] tracking-wide">
        Feel the rhythm. See the sound.
      </p>
    </header>
  );
}
