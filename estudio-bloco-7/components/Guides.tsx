/** The drafting grid: one 1px line per column, fixed behind the page. */
export default function Guides() {
  return (
    <div className="guides" aria-hidden>
      <div>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={i >= 4 ? 'max-md:hidden' : ''} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}
