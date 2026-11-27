const PHRASES = [
  "A little magic behind each door.",
  "Unlock a world of festive possibilities.",
  "Delve into a tapestry of holiday innovation.",
  "Your AI-powered Christmas journey starts here.",
  "In conclusion, we have revolutionized the festive landscape.",
];
const BADGES = [
  "✨ Powered by vibes",
  "Seamlessly festive",
  "Agentic gingerbread",
  "10x your jingle",
  "The future is a snowball",
  "🚀 Revolutionary",
  "Synergy detected",
  "Christmas, reimagined",
  "🧠 Festive intelligence",
  "Built different. Literally.",
  "Have you tried more agents?",
  "Infinite holiday potential",
  "Quantum tinsel",
  "Oops, all gradients",
  "🦄 Unicorn-ready",
  "Delight at scale",
];

export function slopPhrase(power: number) {
  return PHRASES[Math.min(4, Math.floor(power / 25))];
}
export function SlopDecorations({ power }: { power: number }) {
  return (
    <div className="adv-slop-decorations" aria-hidden>
      {BADGES.slice(0, Math.floor(power / 6)).map((text, i) => (
        <span
          key={text}
          style={{
            left: `${(i * 37 + 7) % 87}%`,
            top: `${(i * 23 + 13) % 86}%`,
            animationDelay: `${-i * 0.7}s`,
            rotate: `${i % 2 ? 12 : -9}deg`,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
export function SlopSlider({
  power,
  onChange,
}: {
  power: number;
  onChange: (power: number) => void;
}) {
  const level = [
    "No slop",
    "Slop curious",
    "Premium slop",
    "Weaponized slop",
    "Maximum brainrot",
  ][Math.min(4, Math.ceil(power / 25))];
  return (
    <label className="adv-slop-control" data-no-snowball>
      <span className="adv-slop-title">
        SLOP POWER <output>{power}%</output>
      </span>
      <span className="adv-slop-level">{level}</span>
      <input
        type="range"
        aria-label="Slop power"
        aria-valuetext={`${power}% slop: ${level}`}
        aria-describedby="adv-slop-description"
        min="0"
        max="100"
        step="1"
        value={power}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span id="adv-slop-description">
        AI slop: weirder visuals, sound + snowballs
      </span>
    </label>
  );
}
