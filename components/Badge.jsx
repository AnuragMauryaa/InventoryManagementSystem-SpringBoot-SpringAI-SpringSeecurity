// Small colored pill for statuses / movement types.
export default function Badge({ color = 'gray', children }) {
  return <span className={`badge ${color}`}>{children}</span>;
}
