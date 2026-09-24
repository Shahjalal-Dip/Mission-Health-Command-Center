export default function Sparkline({ values, width = 72, height = 24, color = "var(--color-accent)" }) {
  const clean = values.filter((v) => v != null);
  if (clean.length < 2) return <div style={{ width, height }} />;

  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;
  const stepX = width / (clean.length - 1);

  const points = clean
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastX = (clean.length - 1) * stepX;
  const lastY = height - ((clean[clean.length - 1] - min) / range) * (height - 4) - 2;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
      <circle cx={lastX} cy={lastY} r="2" fill={color} />
    </svg>
  );
}
