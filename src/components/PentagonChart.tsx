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
  { key: 'soul', label: 'Alma', angle: -90, hue: 225 },
  { key: 'personality', label: 'Personalidad', angle: -18, hue: 248 },
  { key: 'pastLife', label: 'Vida\nPasada', angle: 54, hue: 225 },
  { key: 'gift', label: 'Don', angle: 126, hue: 207 },
  { key: 'path', label: 'Camino', angle: 198, hue: 248 },
] as const;

export default function PentagonChart({ numbers }: Props) {
  const navigate = useNavigate();
  const cx = 160;
  const cy = 160;
  const r = 110;
  const circleR = 36;

  const points = LABELS.map(({ key, label, angle, hue }) => {
    const rad = (angle * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return { key, label, x, y, value: numbers[key], hue };
  });

  const pentagonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex justify-center">
      <svg width="320" height="320" viewBox="0 0 320 320">
        <defs>
          {points.map(p => (
            <radialGradient key={`grad-${p.key}`} id={`orb-${p.key}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={`hsl(${p.hue} 60% 82%)`} />
              <stop offset="100%" stopColor={`hsl(${p.hue} 50% 68%)`} />
            </radialGradient>
          ))}
          <radialGradient id="center-orb" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="hsl(16 100% 76%)" />
            <stop offset="100%" stopColor="hsl(16 100% 66%)" />
          </radialGradient>
          <filter id="orb-shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="hsl(225 40% 20%)" floodOpacity="0.15" />
          </filter>
          <filter id="orb-inner-glow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="-1" result="offsetBlur" />
            <feFlood floodColor="white" floodOpacity="0.35" result="color" />
            <feComposite in="color" in2="offsetBlur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="glow" />
            </feMerge>
          </filter>
        </defs>

        {/* Pentagon outline */}
        <path
          d={pentagonPath}
          fill="none"
          stroke="hsl(225 64% 80%)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Connection lines to center */}
        {points.map(p => (
          <line
            key={`line-${p.key}`}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="hsl(225 64% 80%)"
            strokeWidth="1.2"
            opacity="0.5"
          />
        ))}

        {/* Center orb */}
        <circle cx={cx} cy={cy} r={12} fill="url(#center-orb)" filter="url(#orb-shadow)" />
        <circle cx={cx} cy={cy} r={12} fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />

        {/* Number orbs */}
        {points.map(p => (
          <g
            key={p.key}
            className="cursor-pointer"
            onClick={() => navigate(`/number/${p.key}`)}
            role="button"
            tabIndex={0}
          >
            {/* Main orb */}
            <circle
              cx={p.x}
              cy={p.y}
              r={circleR}
              fill={`url(#orb-${p.key})`}
              filter="url(#orb-shadow)"
            />
            {/* Number */}
            <text
              x={p.x}
              y={p.y - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontFamily="Lora, serif"
              fontWeight="700"
              fontSize="20"
            >
              {p.value}
            </text>
            {/* Label */}
            {p.label.includes('\n') ? (
              p.label.split('\n').map((line, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={p.y + 12 + i * 11}
                  textAnchor="middle"
                  fill="white"
                  fontFamily="Lato, sans-serif"
                  fontWeight="500"
                  fontSize="9"
                  opacity="0.9"
                >
                  {line}
                </text>
              ))
            ) : (
              <text
                x={p.x}
                y={p.y + 14}
                textAnchor="middle"
                fill="white"
                fontFamily="Lato, sans-serif"
                fontWeight="500"
                fontSize="9"
                opacity="0.9"
              >
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
