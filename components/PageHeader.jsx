// Page title + optional right-aligned actions, wraps nicely on mobile.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted" style={{ margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      <div className="row">{children}</div>
    </div>
  );
}
