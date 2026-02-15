import { useNavigate } from 'react-router-dom';

interface Props {
  numbers: {
    soul: number;
    personality: number;
    pastLife: number;
    gift: number;
    path: number;
  };
}

const LABELS = [
  { key: 'soul', label: 'Alma', angle: -90 },
  { key: 'personality', label: 'Personalidad', angle: -18 },
  { key: 'pastLife', label: 'Vida Pasada', angle: 54 },
  { key: 'gift', label: 'Don', angle: 126 },
  { key: 'path', label: 'Camino', angle: 198 },
] as const;

export default function PentagonChart({ numbers }: Props) {
  const navigate = useNavigate();
  const cx = 150;
  const cy = 150;
  const r = 100;
  const circleR = 28;

  const points = LABELS.map(({ key, label, angle }) => {
    const rad = (angle * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return { key, label, x, y, value: numbers[key] };
  });

  const pentagonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex justify-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <path d={pentagonPath} fill="none" stroke="hsl(225 25% 88%)" strokeWidth="1" strokeDasharray="4 4" />
        
        {points.map(p => (
          <line key={p.key} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(225 25% 88%)" strokeWidth="1" strokeDasharray="4 4" />
        ))}

        <circle cx={cx} cy={cy} r={16} fill="hsl(25 95% 74% / 0.15)" stroke="hsl(25 95% 74% / 0.4)" strokeWidth="1" />

        {points.map(p => (
          <g key={p.key} className="cursor-pointer" onClick={() => navigate(`/number/${p.key}`)}>
            <circle cx={p.x} cy={p.y} r={circleR} className="fill-card" stroke="hsl(225 100% 93%)" strokeWidth="2" filter="url(#glow)" />
            <text x={p.x} y={p.y - 4} textAnchor="middle" className="fill-foreground font-lora text-lg font-bold" dominantBaseline="middle" fontSize="18">
              {p.value}
            </text>
            <text x={p.x} y={p.y + 14} textAnchor="middle" className="fill-muted-foreground font-lato" fontSize="8" fontWeight="600">
              {p.label}
            </text>
          </g>
        ))}

        <defs>
          <filter id="glow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="hsl(25 95% 74%)" floodOpacity="0.2" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
