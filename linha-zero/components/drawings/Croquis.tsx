/*
  Elevation sketches for the three projects. Each one follows the massing of its photo,
  so sketch and result read as the same building. Lines overshoot their corners a few
  units, the way an architect's hand sketch does.
*/

type Seg = [number, number, number, number, number?];

// Extends a segment past both ends by `o` units.
function ln([x1, y1, x2, y2, o = 7]: Seg): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = (dx / len) * o;
  const uy = (dy / len) * o;
  const f = (n: number) => +n.toFixed(1);
  return `M${f(x1 - ux)} ${f(y1 - uy)} L${f(x2 + ux)} ${f(y2 + uy)}`;
}
const lines = (segs: Seg[]) => segs.map(ln).join(' ');
const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let v = from; v <= to; v += step) out.push(v);
  return out;
};
const person = (x: number, y: number) =>
  `M${x} ${y - 40} m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M${x} ${y - 35} L${x} ${y - 16} M${x} ${y - 16} L${x - 6} ${y} M${x} ${y - 16} L${x + 6} ${y} M${x} ${y - 29} L${x - 8} ${y - 20} M${x} ${y - 29} L${x + 8} ${y - 20}`;

type Stroke = { d: string; w?: number; o?: number; accent?: boolean };

const ipe: Stroke[] = [
  { d: lines([[40, 500, 760, 500, 14]]), w: 1.4 },
  // wood frame and its glass box
  {
    d: lines([
      [170, 230, 470, 230],
      [170, 230, 170, 500],
      [470, 230, 470, 500],
      [195, 330, 445, 330],
      [195, 330, 195, 500],
      [445, 330, 445, 500],
    ]),
    w: 1.6,
  },
  { d: range(225, 415, 30).map((x) => `M${x} 330 V500`).join(' ') + ' M195 420 H445', w: 0.8, o: 0.8 },
  { d: range(182, 460, 13).map((x) => `M${x} 240 V${x % 2 ? 320 : 316}`).join(' '), w: 0.6, o: 0.55 },
  // upper floor and skillion roof
  {
    d: lines([
      [300, 156, 680, 120, 12],
      [340, 152, 340, 230],
      [630, 126, 630, 300],
      [340, 178, 630, 178],
      [470, 300, 640, 300],
    ]),
    w: 1.4,
  },
  { d: range(390, 590, 50).map((x) => `M${x} 178 V226`).join(' '), w: 0.8, o: 0.8 },
  // black wall with vertical seams + glass rail
  { d: lines([[470, 300, 760, 300], [760, 300, 760, 500]]), w: 1.6 },
  { d: range(490, 750, 18).map((x) => `M${x} 304 V496`).join(' '), w: 0.7, o: 0.65 },
  { d: lines([[470, 272, 700, 272, 4]]) + ' ' + range(520, 700, 60).map((x) => `M${x} 272 V300`).join(' '), w: 0.8, o: 0.7 },
  // tree, person, dimension
  {
    d: 'M58 332 c-34 -18 -26 -72 16 -72 c8 -42 72 -44 82 -4 c42 -2 52 50 20 72 c-8 30 -82 34 -118 4 M100 332 L100 500',
    w: 0.9,
    o: 0.7,
  },
  { d: person(330, 500), w: 0.9 },
  { d: 'M170 196 H470 M164 202 L176 190 M464 202 L476 190 M170 204 V188 M470 204 V188', w: 0.8, accent: true },
];

const mirante: Stroke[] = [
  { d: lines([[30, 470, 770, 470, 12]]), w: 1.4 },
  // top slab, tall side wall
  {
    d: lines([
      [80, 110, 640, 110],
      [80, 140, 640, 140],
      [80, 110, 80, 140, 4],
      [640, 96, 640, 470],
      [700, 96, 700, 470],
      [640, 96, 700, 96, 4],
    ]),
    w: 1.6,
  },
  // cumaru soffits
  { d: range(160, 630, 9).map((x) => `M${x} 142 V156`).join(' '), w: 0.6, o: 0.55 },
  { d: range(160, 630, 9).map((x) => `M${x} 307 V320`).join(' '), w: 0.6, o: 0.55 },
  // columns, middle slab
  { d: lines([[130, 140, 130, 470], [150, 140, 150, 470], [60, 280, 640, 280], [60, 305, 640, 305], [60, 280, 60, 305, 4]]), w: 1.4 },
  // upper floor glazing + glass rail
  {
    d: lines([
      [210, 186, 360, 186, 4],
      [210, 186, 210, 278, 4],
      [360, 186, 360, 278, 4],
      [450, 186, 590, 186, 4],
      [450, 186, 450, 278, 4],
      [590, 186, 590, 278, 4],
    ]),
    w: 1,
  },
  { d: 'M285 186 V278 M520 186 V278', w: 0.7, o: 0.7 },
  { d: lines([[150, 240, 640, 240, 3]]), w: 0.8, o: 0.75 },
  // ground floor glazing
  {
    d: lines([
      [220, 330, 360, 330, 4],
      [220, 330, 220, 470, 4],
      [360, 330, 360, 470, 4],
      [440, 330, 600, 330, 4],
      [440, 330, 440, 470, 4],
      [600, 330, 600, 470, 4],
    ]),
    w: 1,
  },
  { d: 'M290 330 V470 M520 330 V470', w: 0.7, o: 0.7 },
  // stair + handrail
  { d: 'M700 470 h16 v-20 h16 v-20 h16 v-20 h16 v-20 h16 v-20 h16 v-20', w: 1 },
  { d: lines([[700, 424, 796, 300, 6]]), w: 0.8, o: 0.75 },
  // pool with lane stripes and ripples
  { d: lines([[30, 492, 770, 492, 8], [30, 566, 770, 566, 8]]), w: 1 },
  { d: lines([[340, 492, 300, 566, 2], [372, 492, 340, 566, 2], [420, 492, 400, 566, 2], [452, 492, 440, 566, 2]]), w: 0.8, o: 0.7 },
  {
    d: 'M90 520 q10 -6 20 0 t20 0 M540 540 q10 -6 20 0 t20 0 M190 548 q8 -5 16 0 t16 0 M620 512 q8 -5 16 0 t16 0',
    w: 0.7,
    o: 0.6,
  },
  { d: person(400, 470), w: 0.9 },
  { d: 'M40 110 V470 M34 116 L46 104 M34 476 L46 464 M32 110 H48 M32 470 H48', w: 0.8, accent: true },
];

const alva: Stroke[] = [
  { d: lines([[20, 640, 620, 640, 12]]), w: 1.4 },
  // volumes: garage, tower, middle block, porch block
  {
    d: lines([
      [20, 300, 140, 300],
      [140, 150, 260, 150],
      [140, 150, 140, 640],
      [260, 150, 260, 210],
      [260, 210, 560, 210],
      [560, 210, 560, 340],
      [250, 340, 600, 340],
      [600, 340, 600, 640],
      [260, 340, 260, 640],
    ]),
    w: 1.6,
  },
  // openings
  {
    d: lines([
      [175, 260, 205, 260, 3],
      [175, 260, 175, 380, 3],
      [205, 260, 205, 380, 3],
      [175, 380, 205, 380, 3],
      [330, 262, 360, 262, 3],
      [330, 262, 330, 292, 3],
      [360, 262, 360, 292, 3],
      [330, 292, 360, 292, 3],
      [420, 262, 450, 262, 3],
      [420, 262, 420, 292, 3],
      [450, 262, 450, 292, 3],
      [420, 292, 450, 292, 3],
      [290, 470, 350, 470, 3],
      [290, 470, 290, 640, 3],
      [350, 470, 350, 640, 3],
      [420, 400, 580, 400],
      [420, 400, 420, 600],
      [400, 600, 600, 600, 2],
    ]),
    w: 1,
  },
  // garage door slats, porch shadow hatch
  { d: range(440, 620, 26).map((y) => `M24 ${y} H128`).join(' '), w: 0.7, o: 0.6 },
  { d: range(430, 572, 12).map((x) => `M${x} 404 L${x - 10} 424`).join(' '), w: 0.6, o: 0.5 },
  // pine canopy + walkway
  {
    d: 'M476 172 c-22 -40 28 -84 70 -62 c30 -42 94 -12 82 30 c40 12 28 72 -12 70 c-22 30 -84 20 -92 -10 c-38 2 -60 -18 -48 -28',
    w: 0.9,
    o: 0.7,
  },
  { d: lines([[300, 640, 252, 744, 4], [360, 640, 398, 744, 4]]) + ' M292 660 H366 M282 684 H376 M272 708 H386 M262 732 H394', w: 0.8, o: 0.75 },
  { d: person(380, 640), w: 0.9 },
  { d: 'M110 150 V640 M104 156 L116 144 M104 646 L116 634 M102 150 H118 M102 640 H118', w: 0.8, accent: true },
];

const sketches = {
  ipe: { view: '0 0 800 600', strokes: ipe, label: 'FACHADA LESTE', dim: { x: 320, y: 186, v: '7,50' } },
  mirante: { view: '0 0 800 600', strokes: mirante, label: 'FACHADA PARA O CANAL', dim: { x: 30, y: 290, v: '6,80', rot: true } },
  alva: { view: '0 0 640 800', strokes: alva, label: 'FACHADA DE ACESSO', dim: { x: 100, y: 395, v: '7,20', rot: true } },
} as const;

export type SketchId = keyof typeof sketches;

export function Croqui({ id, index }: { id: SketchId; index: string }) {
  const s = sketches[id];
  const [, , w, h] = s.view.split(' ').map(Number) as [number, number, number, number];
  const dim = s.dim as { x: number; y: number; v: string; rot?: boolean };
  return (
    <svg className="draw h-full w-full" viewBox={s.view} aria-hidden="true" focusable="false" data-croqui>
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
      <text
        className="t text-cyan"
        x={dim.x}
        y={dim.y}
        fontSize={13}
        textAnchor="middle"
        transform={dim.rot ? `rotate(-90 ${dim.x} ${dim.y})` : undefined}
        data-note
      >
        {dim.v}
      </text>
      <text className="t" x={28} y={h - 26} fontSize={12} opacity={0.7} data-note>
        CROQUI {index} · {s.label}
      </text>
      <text className="t" x={w - 28} y={h - 26} fontSize={12} opacity={0.5} textAnchor="end" data-note>
        ESC. LIVRE
      </text>
    </svg>
  );
}
