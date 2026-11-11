/*
  The same L-shaped house at each stage of the process, from bubble diagram to the built
  elevation. Same footprint as the hero plan, at a much smaller scale (viewBox 240×160).
*/

type Stroke = { d: string; w?: number; o?: number; accent?: boolean };
type Note = { x: number; y: number; t: string; anchor?: 'start' | 'middle' | 'end'; accent?: boolean };

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

const L = 'M40 30 H130 V70 H210 V130 H40 Z';

const stages: { strokes: Stroke[]; notes: Note[] }[] = [
  // 01 Escuta: bubble diagram of the program
  {
    strokes: [
      { d: circle(92, 98, 30), w: 1.1 },
      { d: circle(60, 44, 19), w: 1.1 },
      { d: circle(156, 104, 22), w: 1.1 },
      { d: circle(184, 44, 22), w: 1.1, accent: true },
      { d: 'M74 58 L82 70 M122 100 L134 102 M168 84 L176 64 M116 80 L166 54', w: 0.8, o: 0.7 },
    ],
    notes: [
      { x: 92, y: 101, t: 'estar', anchor: 'middle' },
      { x: 60, y: 47, t: 'suíte', anchor: 'middle' },
      { x: 156, y: 107, t: 'coz.', anchor: 'middle' },
      { x: 184, y: 47, t: 'jardim', anchor: 'middle', accent: true },
    ],
  },
  // 02 Estudo preliminar: zoning + sun path
  {
    strokes: [
      { d: 'M40 30 H130 V130 H40 Z', w: 1 },
      { d: 'M130 70 H210 V130 H130', w: 1 },
      { d: 'M40 78 H130', w: 0.7, o: 0.6 },
      { d: 'M48 86 L60 74 M48 102 L76 74 M48 118 L92 74 M56 126 L108 74 M72 126 L124 74 M88 126 L130 84 M104 126 L130 100', w: 0.6, o: 0.45 },
      { d: 'M18 150 Q120 -10 222 150', w: 0.8, accent: true },
      { d: circle(120, 32, 5), w: 0.9, accent: true },
    ],
    notes: [
      { x: 84, y: 56, t: 'íntimo', anchor: 'middle' },
      { x: 170, y: 104, t: 'social', anchor: 'middle' },
      { x: 132, y: 22, t: 'sol', accent: true },
    ],
  },
  // 03 Anteprojeto: walls and rooms
  {
    strokes: [
      { d: L, w: 2 },
      { d: 'M88 30 V78 M40 78 H88 M130 70 V96 M130 112 V130 M170 70 V130', w: 1 },
      { d: 'M88 64 L76 64 M76 64 A12 12 0 0 0 88 76', w: 0.7, o: 0.7 },
      { d: 'M62 130 H118 M180 70 H204', w: 0.7, o: 0.8 },
    ],
    notes: [],
  },
  // 04 Projeto executivo: dimensions, details, hatch
  {
    strokes: [
      { d: L, w: 2 },
      { d: 'M88 30 V78 M40 78 H88 M130 70 V96 M130 112 V130 M170 70 V130', w: 1 },
      { d: 'M40 16 H210 M40 12 V22 M130 12 V22 M210 12 V22 M36 20 L44 12 M126 20 L134 12 M206 20 L214 12', w: 0.7, accent: true },
      { d: 'M24 30 V130 M20 30 H30 M20 130 H30 M20 34 L28 26 M20 134 L28 126', w: 0.7, accent: true },
      { d: 'M140 80 L150 70 M140 92 L162 70 M144 100 L170 74 M156 100 L170 86', w: 0.5, o: 0.5 },
      { d: 'M60 144 H100 M60 140 V148 M70 142 V146 M80 140 V148 M100 140 V148', w: 0.6, o: 0.7 },
    ],
    notes: [
      { x: 85, y: 12, t: '11,00', anchor: 'middle', accent: true },
      { x: 170, y: 12, t: '8,00', anchor: 'middle', accent: true },
      { x: 108, y: 148, t: '1:100' },
    ],
  },
  // 05 Obra acompanhada: the built elevation
  {
    strokes: [
      { d: 'M14 136 H226', w: 1.3 },
      { d: 'M40 136 V44 H124 V136 M124 84 H214 V136', w: 1.6 },
      { d: 'M54 60 H110 V80 H54 Z M138 96 H200 V136 M150 96 V136 M162 96 V136 M174 96 V136 M186 96 V136', w: 0.8, o: 0.85 },
      { d: 'M40 44 L28 40 M124 44 L136 40', w: 0.8, o: 0.6 },
      { d: 'M190 70 c-12 -18 6 -38 24 -28 c18 -6 30 14 18 26 c4 14 -20 22 -28 12 c-10 6 -22 -2 -14 -10 M206 72 V136', w: 0.8, o: 0.7 },
      { d: 'M84 136 m-3 -26 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M84 113 V124 M84 124 L80 136 M84 124 L88 136', w: 0.7 },
    ],
    notes: [{ x: 18, y: 152, t: '±0,00', accent: true }],
  },
];

export function ProcessSketch({ stage }: { stage: number }) {
  const s = stages[stage];
  if (!s) return null;
  return (
    <svg className="draw h-full w-full" viewBox="0 0 240 160" aria-hidden="true" focusable="false" data-stage>
      {s.strokes.map((st, i) => (
        <path
          key={i}
          d={st.d}
          strokeWidth={st.w ?? 1}
          opacity={st.o ?? 1}
          className={st.accent ? 'text-cyan' : undefined}
          data-stroke
        />
      ))}
      {s.notes.map((n) => (
        <text
          key={n.t + n.x}
          className={`t ${n.accent ? 'text-cyan' : ''}`}
          x={n.x}
          y={n.y}
          fontSize={8}
          textAnchor={n.anchor ?? 'start'}
          opacity={0.8}
          data-note
        >
          {n.t}
        </text>
      ))}
    </svg>
  );
}
