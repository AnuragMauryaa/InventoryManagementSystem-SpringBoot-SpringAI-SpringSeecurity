const PALETTE = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

function safeData(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item) => item)
    .map((item) => ({
      ...item,
      value: Number(item.value || 0),
      label: String(item.label ?? ""),
    }));
}

function EmptyChart() {
  return (
    <div
      style={{
        minHeight: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: 13,
      }}
    >
      No data available
    </div>
  );
}

/* -------------------------------------------------------
 * BAR CHART
 * data: [{ label, value }]
 * ----------------------------------------------------- */

export function BarChart({
  data = [],
  height = 220,
  format = (value) => value,
}) {
  const rows = safeData(data);

  if (rows.length === 0) {
    return <EmptyChart />;
  }

  const width = 480;
  const h = height;

  const pad = {
    top: 16,
    right: 16,
    bottom: 36,
    left: 48,
  };

  const innerWidth =
    width - pad.left - pad.right;

  const innerHeight =
    h - pad.top - pad.bottom;

  const max = Math.max(
    1,
    ...rows.map((item) => item.value)
  );

  const ticks = 4;

  const barWidth =
    innerWidth / rows.length;

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${width} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Bar chart"
    >
      {Array.from({
        length: ticks + 1,
      }).map((_, index) => {
        const value =
          (max / ticks) * index;

        const y =
          pad.top +
          innerHeight -
          (innerHeight * index) /
            ticks;

        return (
          <g key={index}>
            <line
              x1={pad.left}
              y1={y}
              x2={
                width - pad.right
              }
              y2={y}
              stroke="#eceff4"
            />

            <text
              x={pad.left - 6}
              y={y + 4}
              textAnchor="end"
              className="chart-axis"
            >
              {format(
                Math.round(value)
              )}
            </text>
          </g>
        );
      })}

      {rows.map((item, index) => {
        const barHeight =
          (item.value / max) *
          innerHeight;

        const x =
          pad.left +
          index * barWidth +
          barWidth * 0.18;

        const y =
          pad.top +
          innerHeight -
          barHeight;

        return (
          <g key={`${item.label}-${index}`}>
            <rect
              x={x}
              y={y}
              width={barWidth * 0.64}
              height={Math.max(
                0,
                barHeight
              )}
              rx="4"
              fill={
                PALETTE[
                  index %
                    PALETTE.length
                ]
              }
            >
              <title>
                {`${item.label}: ${format(
                  item.value
                )}`}
              </title>
            </rect>

            <text
              x={
                pad.left +
                index * barWidth +
                barWidth / 2
              }
              y={h - 14}
              textAnchor="middle"
              className="chart-axis"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------
 * LINE CHART
 * data: [{ label, value }]
 * ----------------------------------------------------- */

export function LineChart({
  data = [],
  height = 220,
  format = (value) => value,
}) {
  const rows = safeData(data);

  if (rows.length === 0) {
    return <EmptyChart />;
  }

  const width = 480;
  const h = height;

  const pad = {
    top: 16,
    right: 16,
    bottom: 36,
    left: 48,
  };

  const innerWidth =
    width - pad.left - pad.right;

  const innerHeight =
    h - pad.top - pad.bottom;

  const max = Math.max(
    1,
    ...rows.map((item) => item.value)
  );

  const stepX =
    rows.length > 1
      ? innerWidth /
        (rows.length - 1)
      : 0;

  const points = rows.map(
    (item, index) => ({
      x:
        rows.length === 1
          ? pad.left +
            innerWidth / 2
          : pad.left +
            index * stepX,

      y:
        pad.top +
        innerHeight -
        (item.value / max) *
          innerHeight,

      item,
    })
  );

  const path = points
    .map(
      (point, index) =>
        `${
          index === 0
            ? "M"
            : "L"
        } ${point.x} ${point.y}`
    )
    .join(" ");

  const baseline =
    pad.top + innerHeight;

  const area =
    points.length > 1
      ? `${path} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
      : null;

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${width} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Line chart"
    >
      {Array.from({
        length: 5,
      }).map((_, index) => {
        const y =
          pad.top +
          (innerHeight * index) /
            4;

        const value =
          max -
          (max * index) / 4;

        return (
          <g key={index}>
            <line
              x1={pad.left}
              y1={y}
              x2={
                width - pad.right
              }
              y2={y}
              stroke="#eceff4"
            />

            <text
              x={pad.left - 6}
              y={y + 4}
              textAnchor="end"
              className="chart-axis"
            >
              {format(
                Math.round(value)
              )}
            </text>
          </g>
        );
      })}

      {area && (
        <path
          d={area}
          fill="#2563eb"
          opacity="0.1"
        />
      )}

      <path
        d={path}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {points.map(
        (point, index) => (
          <g
            key={`${point.item.label}-${index}`}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#fff"
              stroke="#2563eb"
              strokeWidth="2"
            >
              <title>
                {`${point.item.label}: ${format(
                  point.item.value
                )}`}
              </title>
            </circle>

            <text
              x={point.x}
              y={h - 14}
              textAnchor="middle"
              className="chart-axis"
            >
              {point.item.label}
            </text>
          </g>
        )
      )}
    </svg>
  );
}

/* -------------------------------------------------------
 * DONUT CHART
 * data: [{ label, value }]
 * ----------------------------------------------------- */

export function DonutChart({
  data = [],
  size = 200,
}) {
  const rows = safeData(data);

  if (rows.length === 0) {
    return <EmptyChart />;
  }

  const total =
    rows.reduce(
      (sum, item) =>
        sum + item.value,
      0
    ) || 1;

  const radius = 70;

  const circumference =
    2 * Math.PI * radius;

  const center = size / 2;

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
        aria-label="Donut chart"
      >
        <g
          transform={`rotate(-90 ${center} ${center})`}
        >
          {rows.map(
            (item, index) => {
              const fraction =
                item.value /
                total;

              const dash =
                fraction *
                circumference;

              const segment = (
                <circle
                  key={`${item.label}-${index}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={
                    PALETTE[
                      index %
                        PALETTE.length
                    ]
                  }
                  strokeWidth="22"
                  strokeDasharray={`${dash} ${
                    circumference -
                    dash
                  }`}
                  strokeDashoffset={
                    -offset
                  }
                >
                  <title>
                    {`${item.label}: ${item.value}`}
                  </title>
                </circle>
              );

              offset += dash;

              return segment;
            }
          )}
        </g>

        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="donut-total"
        >
          {total.toLocaleString(
            "en-IN"
          )}
        </text>

        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          className="chart-axis"
        >
          total
        </text>
      </svg>

      <ul className="legend">
        {rows.map(
          (item, index) => (
            <li
              key={`${item.label}-${index}`}
            >
              <span
                className="legend-dot"
                style={{
                  background:
                    PALETTE[
                      index %
                        PALETTE.length
                    ],
                }}
              />

              {item.label}

              <span className="muted">
                {" "}
                (
                {item.value.toLocaleString(
                  "en-IN"
                )}
                )
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
    </div>
  );
}
