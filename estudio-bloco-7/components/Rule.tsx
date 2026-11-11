/** A full-width 1px rule that draws itself when it enters the viewport. */
export default function Rule({ className = '' }: { className?: string }) {
  return <div className={`rule ${className}`} data-rule aria-hidden />;
}
