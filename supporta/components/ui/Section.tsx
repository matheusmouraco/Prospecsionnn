import { SectionLabel as SectionLabelInline } from "./SectionLabel";
import type { ReactNode } from "react";

type Tone = "paper" | "ink" | "pink" | "white";

const tones: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  pink: "bg-pink text-ink on-pink",
  white: "bg-white text-ink",
};

export function Section({
  id,
  tone = "paper",
  className = "",
  children,
  labelledBy,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-20 md:py-28 ${tones[tone]} ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  label,
  title,
  lead,
  tone = "light",
  as: Tag = "h2",
  align = "left",
  className = "",
}: {
  id?: string;
  label?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark" | "pink";
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
}) {
  const leadColor = tone === "dark" ? "text-mist" : tone === "pink" ? "text-ink" : "text-graphite";
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {label ? <SectionLabelInline tone={tone}>{label}</SectionLabelInline> : null}
      <Tag id={id} className="mt-4 text-[clamp(2rem,5.2vw,3.5rem)] tracking-[-0.05em]">
        {title}
      </Tag>
      {lead ? <p className={`mt-5 text-lg leading-relaxed md:text-xl ${leadColor}`}>{lead}</p> : null}
    </div>
  );
}
