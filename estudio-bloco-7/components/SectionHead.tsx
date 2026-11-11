import Rule from './Rule';

type Props = { index: string; label: string; title: string; id?: string };

/** Section opener: rule, mono index in columns 1 to 3, display title from column 4. */
export default function SectionHead({ index, label, title, id }: Props) {
  return (
    <header className="relative">
      <Rule />
      <div className="g pt-3 pb-12 md:pb-20">
        <p className="label c col-span-4 md:col-span-3" data-fade>
          ({index}) {label}
        </p>
        <h2
          id={id}
          className="display c col-span-4 md:col-span-9 mt-6 md:mt-0 text-[clamp(2.25rem,6.2vw,6.5rem)]"
          data-split
        >
          {title}
        </h2>
      </div>
    </header>
  );
}
