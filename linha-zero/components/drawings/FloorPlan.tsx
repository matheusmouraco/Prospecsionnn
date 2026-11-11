/*
  Floor plan of "Casa Jatobá", an L-shaped single storey house.
  Scale: 40 user units = 1 m. Every layer is a <g data-layer> so GSAP can draw it on its own.
  Coordinates are hand-placed; keep them on the 5-unit grid when editing.
*/

type Layer =
  | 'walls'
  | 'inner'
  | 'openings'
  | 'labels'
  | 'dims'
  | 'marks'
  | 'furniture'
  | 'site'
  | 'detail';

const outerWalls = [
  'M120 120 H170',
  'M290 120 H385',
  'M425 120 H560',
  'M560 120 V260',
  'M560 260 H600',
  'M690 260 H740',
  'M860 260 H880',
  'M880 260 V300',
  'M880 480 V520',
  'M880 520 H860',
  'M740 520 H500',
  'M180 520 H120',
  'M120 520 V450',
  'M120 400 V120',
];

const innerWalls = [
  'M340 120 V250',
  'M340 290 V310',
  'M120 310 H340',
  'M450 120 V230',
  'M340 230 H385',
  'M425 230 H490',
  'M530 230 H560',
  'M560 260 V330',
  'M560 450 V520',
];

const windows = [
  'M170 116 H290 M170 124 H290',
  'M385 116 H425 M385 124 H425',
  'M600 256 H690 M600 264 H690',
  'M740 256 H860 M740 264 H860',
  'M876 300 V480 M884 300 V480',
  'M740 516 H806 M794 524 H860',
  'M180 516 H500 M180 524 H500 M260 516 V524 M340 516 V524 M420 516 V524',
  'M718 280 V500 M722 280 V500',
];

const doors = [
  { leaf: 'M120 400 L170 400', arc: 'M170 400 A50 50 0 0 1 120 450' },
  { leaf: 'M340 250 L300 250', arc: 'M300 250 A40 40 0 0 0 340 290' },
  { leaf: 'M385 230 L385 190', arc: 'M385 190 A40 40 0 0 1 425 230' },
  { leaf: 'M530 230 L530 190', arc: 'M530 190 A40 40 0 0 0 490 230' },
];

const rooms = [
  { x: 304, y: 228, name: 'SUÍTE', area: '26,1 m²' },
  { x: 395, y: 178, name: 'BANHO', area: '' },
  { x: 505, y: 178, name: 'CLOSET', area: '' },
  { x: 330, y: 334, name: 'ESTAR · JANTAR', area: '57,8 m²' },
  { x: 640, y: 326, name: 'COZINHA', area: '26,0 m²' },
  { x: 760, y: 424, name: 'VARANDA', area: '26,0 m²' },
];

/* Dimension chains: extension lines, the dim line, 45° ticks and the value. */
const dims = {
  lines: [
    'M120 106 V70 M560 106 V70 M880 248 V70 M110 80 H890',
    'M106 120 H70 M106 310 H70 M106 520 H70 M80 110 V530',
    'M894 260 H930 M894 520 H930 M920 250 V530',
  ],
  ticks: [
    'M114 86 L126 74 M554 86 L566 74 M874 86 L886 74',
    'M74 126 L86 114 M74 316 L86 304 M74 526 L86 514',
    'M914 266 L926 254 M914 526 L926 514',
  ],
  text: [
    { x: 340, y: 72, v: '11,00' },
    { x: 720, y: 72, v: '8,00' },
    { x: 72, y: 215, v: '4,75', rot: true },
    { x: 72, y: 415, v: '5,25', rot: true },
    { x: 912, y: 390, v: '6,50', rot: true },
  ],
};

// Interior dimensions that only appear when the plan "finishes" in the pinned section.
const detailDims = [
  { d: 'M130 296 H330 M130 290 V302 M330 290 V302', x: 230, y: 289, v: '5,50' },
  { d: 'M570 506 H710 M570 500 V512 M710 500 V512', x: 640, y: 499, v: '4,00' },
  { d: 'M730 506 H870 M730 500 V512 M870 500 V512', x: 800, y: 499, v: '4,00' },
  { d: 'M548 330 V450 M542 330 H554 M542 450 H554', x: 536, y: 390, v: '3,00', rot: true },
];

const furniture = [
  // suite
  'M150 150 H260 V280 H150 Z',
  'M160 158 H200 V178 H160 Z M210 158 H250 V178 H210 Z',
  'M150 200 H260',
  'M268 150 H296 V176 H268 Z',
  // bath + closet
  'M350 128 H440 V150 H350 Z',
  'M395 139 m-8 0 a8 6 0 1 0 16 0 a8 6 0 1 0 -16 0',
  'M458 130 H552 M458 140 H552 M458 214 H552',
  // living
  'M140 448 H310 V492 H140 Z M140 462 H310',
  'M330 450 H372 V492 H330 Z',
  'M178 386 H282 V424 H178 Z',
  'M160 368 H300 V440 H160 Z',
  // dining
  'M400 362 H516 V420 H400 Z',
  'M412 346 H432 V356 H412 Z M448 346 H468 V356 H448 Z M484 346 H504 V356 H484 Z',
  'M412 426 H432 V436 H412 Z M448 426 H468 V436 H448 Z M484 426 H504 V436 H484 Z',
  // kitchen
  'M570 272 H710 V298 H570 Z',
  'M640 285 m-10 0 a10 7 0 1 0 20 0 a10 7 0 1 0 -20 0',
  'M592 372 H690 V412 H592 Z',
  'M604 428 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M640 428 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M676 428 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
  // terrace
  'M744 296 H782 V388 H744 Z M744 312 H782',
  'M800 296 H838 V388 H800 Z M800 312 H838',
  'M820 452 m-26 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0',
];

// Deterministic lawn hatch so server and client render the same marks.
function lawnMarks(): string {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const marks: string[] = [];
  for (let i = 0; i < 64; i++) {
    const x = 150 + rnd() * 700;
    const y = 552 + rnd() * 70;
    if (x > 560 && x < 720 && y < 600) continue; // keep the tree canopy clear
    marks.push(`M${x.toFixed(0)} ${y.toFixed(0)} l5 -7 M${(x + 5).toFixed(0)} ${y.toFixed(0)} l4 -5`);
  }
  return marks.join(' ');
}

const site = [
  // property line
  'M40 40 H960 V630 H40 Z',
  // entry path
  'M40 405 H120 M40 445 H120 M60 405 V445 M80 405 V445 M100 405 V445',
  // tree canopy + trunk (the big tree in front of the house)
  'M590 588 c-6 -30 22 -52 50 -44 c18 -22 58 -14 64 12 c28 2 36 40 14 56 c4 26 -30 42 -52 28 c-18 18 -56 10 -60 -14 c-22 -6 -26 -30 -16 -38',
  'M646 584 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0',
  lawnMarks(),
];

export function FloorPlan({
  layers,
  className = '',
  id,
}: {
  layers: Layer[];
  className?: string;
  id?: string;
}) {
  const has = (l: Layer) => layers.includes(l);
  return (
    <svg
      id={id}
      className={`draw ${className}`}
      viewBox="0 0 1000 640"
      aria-hidden="true"
      focusable="false"
    >
      {has('site') && (
        <g data-layer="site" strokeWidth={0.8} opacity={0.55}>
          {site.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
      {has('furniture') && (
        <g data-layer="furniture" strokeWidth={0.9} opacity={0.7}>
          {furniture.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
      {has('walls') && (
        <g data-layer="walls" strokeWidth={3.2} strokeLinecap="square">
          {outerWalls.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
      {has('inner') && (
        <g data-layer="inner" strokeWidth={1.6} strokeLinecap="square">
          {innerWalls.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      )}
      {has('openings') && (
        <g data-layer="openings" strokeWidth={0.9}>
          {windows.map((d, i) => (
            <path key={i} d={d} />
          ))}
          {doors.map((door, i) => (
            <g key={i}>
              <path d={door.leaf} strokeWidth={1.2} />
              <path d={door.arc} opacity={0.5} />
            </g>
          ))}
        </g>
      )}
      {has('labels') && (
        <g data-layer="labels">
          {rooms.map((r) => (
            <text key={r.name} x={r.x} y={r.y} textAnchor="middle" fontSize={11} opacity={0.85}>
              {r.name}
              {r.area && (
                <tspan x={r.x} dy={15} fontSize={9.5} opacity={0.6}>
                  {r.area}
                </tspan>
              )}
            </text>
          ))}
        </g>
      )}
      {has('dims') && (
        <g data-layer="dims" className="text-cyan">
          {dims.lines.map((d, i) => (
            <path key={i} d={d} strokeWidth={0.7} />
          ))}
          {dims.ticks.map((d, i) => (
            <path key={`t${i}`} d={d} strokeWidth={1.3} />
          ))}
          {dims.text.map((t) => (
            <text
              key={t.v + t.x}
              x={t.x}
              y={t.y}
              fontSize={11}
              textAnchor="middle"
              transform={t.rot ? `rotate(-90 ${t.x} ${t.y})` : undefined}
              dy={t.rot ? 0 : -4}
            >
              {t.v}
            </text>
          ))}
        </g>
      )}
      {has('marks') && (
        <g data-layer="marks">
          {/* level ±0,00: the "linha zero" every drawing is measured from */}
          <g className="text-cyan" data-mark="level">
            <path d="M448 474 H530" strokeWidth={0.8} />
            <path d="M458 474 L466 462 L474 474 Z" strokeWidth={0.9} />
            <text x={480} y={468} fontSize={11}>
              ±0,00
            </text>
          </g>
          {/* section cut A */}
          <g data-mark="cut" opacity={0.8}>
            <path d="M640 232 V250 M640 530 V548" strokeWidth={1.4} />
            <path d="M640 220 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" strokeWidth={0.8} />
            <path d="M640 560 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" strokeWidth={0.8} />
            <text x={640} y={224} fontSize={10} textAnchor="middle">
              A
            </text>
            <text x={640} y={564} fontSize={10} textAnchor="middle">
              A
            </text>
          </g>
          {/* graphic scale 0 1 2 5 m */}
          <g data-mark="scale" opacity={0.8}>
            <path d="M120 592 H320" strokeWidth={0.9} />
            <path
              d="M120 586 V598 M160 588 V596 M200 586 V598 M240 588 V596 M280 588 V596 M320 586 V598"
              strokeWidth={0.9}
            />
            <text x={120} y={614} fontSize={9.5} textAnchor="middle">
              0
            </text>
            <text x={160} y={614} fontSize={9.5} textAnchor="middle">
              1
            </text>
            <text x={200} y={614} fontSize={9.5} textAnchor="middle">
              2
            </text>
            <text x={320} y={614} fontSize={9.5} textAnchor="middle">
              5 m
            </text>
          </g>
          {/* north */}
          <g data-mark="north" opacity={0.85}>
            <path d="M900 592 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0" strokeWidth={0.8} />
            <path d="M900 606 V574 M893 584 L900 574 L907 584" strokeWidth={1.1} />
            <text x={900} y={566} fontSize={10} textAnchor="middle">
              N
            </text>
          </g>
        </g>
      )}
      {has('detail') && (
        <g data-layer="detail" className="text-cyan">
          {detailDims.map((d) => (
            <g key={d.d}>
              <path d={d.d} strokeWidth={0.7} />
              <text
                x={d.x}
                y={d.y}
                fontSize={9.5}
                textAnchor="middle"
                transform={d.rot ? `rotate(-90 ${d.x} ${d.y})` : undefined}
              >
                {d.v}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
