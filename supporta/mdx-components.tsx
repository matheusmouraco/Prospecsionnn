import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 text-2xl font-semibold tracking-[-0.04em] text-ink md:text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-ink" {...props} />,
  p: (props) => <p className="mt-4 text-[17px] leading-relaxed text-graphite" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-graphite marker:text-pink" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] leading-relaxed text-graphite" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} className="link" {...props} />
    ) : (
      <a href={href} className="link" target="_blank" rel="noopener" {...props} />
    ),
  code: (props) => <code className="rounded bg-line px-1.5 py-0.5 font-mono text-[15px] text-ink" {...props} />,
  table: (props) => (
    <div className="relative mt-6 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left text-[15px]" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-line bg-paper px-4 py-3 font-semibold" {...props} />,
  td: (props) => <td className="border-b border-line px-4 py-3 text-graphite" {...props} />,
  blockquote: (props) => <blockquote className="mt-6 border-l-4 border-pink pl-5 text-lg text-ink" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
