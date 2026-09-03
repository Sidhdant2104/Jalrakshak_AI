export default function Card({ eyebrow, title, action, children, className = "", padded = true }) {
  return (
    <section className={`glass-card ${padded ? "glass-pad" : ""} ${className}`.trim()}>
      {(eyebrow || title || action) && (
        <header className="card-head">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h3>{title}</h3> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
