// Dependency-free SVG charts. They scale to their container width via a
// viewBox + preserveAspectRatio, so they stay responsive on phone and laptop.

const PALETTE = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#db2777'];

// Vertical bar chart. data: [{ label, value }]
export function BarChart({ data, height = 220, format = (v) => v }) {
  const w = 480;
  const h = height;
  const pad = { top: 16, right: 12, bottom: 36, left: 40 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = innerW / data.length;
  const ticks = 4;

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" role="img">
      {/* y grid + labels */}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const val = (max / ticks) * i;
        const y = pad.top + innerH - (innerH * i) / ticks;
        return (
          <g key={i}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#eceff4" />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" className="chart-axis">
              {format(Math.round(val))}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bh = (d.value / max) * innerH;
        const x = pad.left + i * barW + barW * 0.18;
        const y = pad.top + innerH - bh;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW * 0.64} height={bh} rx="4" fill={PALETTE[i % PALETTE.length]}>
              <title>{`${d.label}: ${format(d.value)}`}</title>
            </rect>
            <text x={pad.left + i * barW + barW / 2} y={h - 14} textAnchor="middle" className="chart-axis">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Smooth-ish line chart. data: [{ label, value }]
export function LineChart({ data, height = 220, format = (v) => v, color = '#2563eb' }) {
  const w = 480;
  const h = height;
  const pad = { top: 16, right: 16, bottom: 36, left: 44 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const pts = data.map((d, i) => ({
    x: pad.left + i * stepX,
    y: pad.top + innerH - (d.value / max) * innerH,
    d,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${pts[pts.length - 1].x} ${pad.top + innerH} L ${pts[0].x} ${pad.top + innerH} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" role="img">
      {Array.from({ length: 5 }).map((_, i) => {
        const y = pad.top + (innerH * i) / 4;
        return <line key={i} x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#eceff4" />;
      })}
      <path d={area} fill={color} opacity="0.1" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p) => (
        <g key={p.d.label}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={color} strokeWidth="2">
            <title>{`${p.d.label}: ${format(p.d.value)}`}</title>
          </circle>
          <text x={p.x} y={h - 14} textAnchor="middle" className="chart-axis">
            {p.d.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Donut chart with legend. data: [{ label, value }]
export function DonutChart({ data, size = 200 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 70;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <svg
        className="chart"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * c;
            const seg = (
              <circle
                key={d.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={PALETTE[i % PALETTE.length]}
                strokeWidth="22"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </circle>
            );
            offset += dash;
            return seg;
          })}
        </g>
        <text x={cx} y={cy - 4} textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="chart-axis">
          total
        </text>
      </svg>
      <ul className="legend">
        {data.map((d, i) => (
          <li key={d.label}>
            <span className="legend-dot" style={{ background: PALETTE[i % PALETTE.length] }} />
            {d.label} <span className="muted">({d.value})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
