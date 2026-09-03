const BLOBS = [
  {
    className: 'animate-aurora-1 -top-40 -left-32 h-[34rem] w-[34rem] opacity-60',
    blur: 110,
    color: 'rgba(99,102,241,0.5)',
  },
  {
    className: 'animate-aurora-2 top-1/3 -right-40 h-[38rem] w-[38rem] opacity-55',
    blur: 120,
    color: 'rgba(168,85,247,0.5)',
  },
  {
    className: 'animate-aurora-3 -bottom-48 left-1/4 h-[36rem] w-[36rem] opacity-45',
    blur: 120,
    color: 'rgba(34,211,238,0.45)',
  },
];

export default function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            background: `radial-gradient(circle, ${blob.color}, transparent 65%)`,
            filter: `blur(${blob.blur}px)`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, transparent 35%, rgba(5,6,14,0.6) 100%)',
        }}
      />
    </div>
  );
}
