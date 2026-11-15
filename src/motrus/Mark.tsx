/* The MOTRUS mark: a ring of twelve with the move at its center. The ring and its dots take the text colour; the
   center is amber. Shared by the page and by the door in the Praxis menu, so it carries no page styles. */

const DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = ((-90 + i * 30) * Math.PI) / 180;
  return { x: 16 + 11 * Math.cos(a), y: 16 + 11 * Math.sin(a) };
});

export function Mark({ size = 28, className = 'mt-mark' }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" width={size} height={size} aria-hidden>
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" />
      {DOTS.map((d, i) => <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r="1.6" fill="currentColor" />)}
      <rect x="13" y="13" width="6" height="6" rx="1.2" transform="rotate(45 16 16)" fill="#fdc26f" />
    </svg>
  );
}
