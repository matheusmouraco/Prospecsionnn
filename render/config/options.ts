/**
 * Wizard option catalog: Portuguese labels shown to the user and the English
 * prompt fragments sent to the image model. Editing this file changes the
 * prompt builder without touching any other code (stage 6 moves it to the DB
 * so it can be edited from the admin panel).
 *
 * `swatch` is a CSS background used as the visual sample on each card.
 * `icon` is a lucide icon name (see components/ui/Icon.tsx).
 */

export type Option = {
  id: string;
  label: string;
  prompt: string;
  hint?: string;
  swatch?: string;
  icon?: string;
  colors?: string[];
};

const wood = (a: string, b: string, c: string) =>
  `repeating-linear-gradient(96deg, ${a} 0 5px, ${b} 5px 7px, ${c} 7px 13px, ${b} 13px 14px)`;
const solid = (c: string) => `linear-gradient(135deg, ${c}, ${c})`;
const stone = (base: string, vein: string) =>
  `linear-gradient(125deg, transparent 38%, ${vein} 40%, transparent 43%), linear-gradient(32deg, transparent 58%, ${vein} 60%, transparent 62%), linear-gradient(160deg, transparent 70%, ${vein} 71%, transparent 73%), ${base}`;
const tiles = (c: string, joint: string) =>
  `linear-gradient(${joint} 1px, transparent 1px) 0 0/22px 22px, linear-gradient(90deg, ${joint} 1px, transparent 1px) 0 0/22px 22px, ${c}`;
const metal = (a: string, b: string, c: string) => `linear-gradient(135deg, ${a}, ${b} 55%, ${c})`;

/* ---------- Etapa 1: tipo de imagem ---------- */

export const INPUT_TYPES: Option[] = [
  {
    id: "3d",
    label: "Modelo 3D",
    hint: "SketchUp, Promob, Revit, Lumion",
    icon: "Box",
    prompt:
      "The base image is a screenshot of a 3D model (SketchUp, Promob, Revit or Lumion) with flat, simplified or untextured materials and basic lighting. Convert it into a real photograph of the built space: replace every flat color with a physically accurate material, add real lighting, soft shadows and ambient occlusion. Remove any software artifacts such as edges outlines, axis lines, UI elements, watermarks or z-fighting.",
  },
  {
    id: "foto",
    label: "Foto do ambiente",
    hint: "Vazio, em obra ou mobiliado",
    icon: "Camera",
    prompt:
      "The base image is a real photograph of an existing space (it may be empty, under construction or furnished). Keep it looking like a real photograph of the same space after the intervention: same camera, same lens distortion, same room.",
  },
  {
    id: "croqui",
    label: "Croqui ou planta",
    hint: "Desenho à mão ou planta humanizada",
    icon: "PenTool",
    prompt:
      "The base image is a hand sketch, line drawing or rendered floor plan. Interpret every line as real architecture and turn the drawing into a photorealistic image with the exact same composition, viewpoint and layout. If it is a top-down floor plan, keep the top-down view and render it as a photorealistic 3D cutaway seen from above.",
  },
  {
    id: "fachada",
    label: "Fachada",
    hint: "Foto ou 3D da área externa",
    icon: "Building2",
    prompt:
      "The base image shows a building facade or exterior area. Keep the building volume, roof shape, number of floors, openings and their positions exactly as they are.",
  },
];

/* ---------- Etapa 2: objetivo ---------- */

export const GOALS: Option[] = [
  {
    id: "realista",
    label: "Deixar realista mantendo tudo",
    hint: "Só acabamento e luz",
    icon: "Sparkles",
    prompt:
      "Make it photorealistic while keeping EVERYTHING that is in the image: the same furniture, the same objects, the same materials and the same colors, only rendered with real textures and real light. Do not add, remove or replace any object.",
  },
  {
    id: "redecorar",
    label: "Redecorar mantendo a estrutura",
    hint: "Troca móveis e decoração",
    icon: "Armchair",
    prompt:
      "Redecorate the space: you may replace loose furniture, decor, textiles and accessories, but keep the architecture, built-in elements, floor, walls finishes and ceiling unless a specific material is requested below.",
  },
  {
    id: "reformar",
    label: "Reformar",
    hint: "Troca revestimentos, mantém paredes e janelas",
    icon: "Hammer",
    prompt:
      "Renovate the space: you may replace finishes (floor, wall coverings, ceiling, cabinetry, countertops, fixtures, furniture) but walls, windows, doors, columns, beams and the room layout must stay exactly where they are.",
  },
  {
    id: "mobiliar",
    label: "Mobiliar ambiente vazio",
    hint: "Coloca móveis e decoração",
    icon: "Sofa",
    prompt:
      "The space is empty or unfinished. Furnish and decorate it completely with furniture at correct real-world scale, placed coherently with the circulation, doors and windows. Finish raw surfaces if they look unfinished.",
  },
  {
    id: "fachada",
    label: "Fachada / área externa",
    hint: "Revestimentos, paisagismo e céu",
    icon: "Trees",
    prompt:
      "Render the exterior as a professional architectural exterior photograph: realistic facade materials, glazing with believable reflections, landscaping, sidewalk and sky. Keep the building geometry untouched.",
  },
];

/* ---------- Etapa 3: ambiente ---------- */

export const ROOMS: Option[] = [
  { id: "cozinha", label: "Cozinha", icon: "ChefHat", prompt: "a kitchen" },
  { id: "sala-estar", label: "Sala de estar", icon: "Sofa", prompt: "a living room" },
  { id: "sala-jantar", label: "Sala de jantar", icon: "UtensilsCrossed", prompt: "a dining room" },
  { id: "dorm-casal", label: "Dormitório casal", icon: "BedDouble", prompt: "a master bedroom" },
  { id: "dorm-infantil", label: "Dormitório infantil", icon: "Baby", prompt: "a children's bedroom" },
  { id: "banheiro", label: "Banheiro", icon: "Bath", prompt: "a bathroom" },
  { id: "lavabo", label: "Lavabo", icon: "Droplets", prompt: "a powder room (guest half bathroom)" },
  { id: "gourmet", label: "Área gourmet", icon: "Flame", prompt: "a Brazilian gourmet area with barbecue grill and countertop" },
  { id: "varanda", label: "Varanda", icon: "Sun", prompt: "an apartment balcony" },
  { id: "closet", label: "Closet", icon: "Shirt", prompt: "a walk-in closet" },
  { id: "home-office", label: "Home office", icon: "Laptop", prompt: "a home office" },
  { id: "escritorio", label: "Escritório comercial", icon: "Briefcase", prompt: "a commercial office" },
  { id: "loja", label: "Loja", icon: "Store", prompt: "a retail store" },
  { id: "fachada", label: "Fachada", icon: "Building2", prompt: "a building facade" },
  { id: "jardim", label: "Jardim", icon: "Trees", prompt: "a garden" },
  { id: "piscina", label: "Piscina", icon: "Waves", prompt: "a pool area" },
];

export const EXTERIOR_ROOMS = new Set(["fachada", "jardim", "piscina"]);

/* ---------- Etapa 4: estilo ---------- */

export const STYLES: Option[] = [
  { id: "moderno", label: "Moderno", hint: "Linhas retas, contraste e vidro", colors: ["#f2f0ec", "#1f1f1f", "#9c8a76", "#c9c6c0"], prompt: "modern style: clean straight lines, flat surfaces, strong contrast, large glass, minimal ornament, integrated lighting" },
  { id: "contemporaneo", label: "Contemporâneo", hint: "Atual, neutro e sofisticado", colors: ["#ece7e1", "#b9a48e", "#5d5650", "#2b2b2b"], prompt: "contemporary style: current, sophisticated, neutral base with warm wood, soft curves mixed with straight lines, layered lighting" },
  { id: "minimalista", label: "Minimalista", hint: "Pouco objeto, muito respiro", colors: ["#fafafa", "#e6e4e0", "#bdb9b2", "#3a3a3a"], prompt: "minimalist style: very few objects, generous empty space, monochrome palette, handleless cabinetry, hidden storage, calm and silent" },
  { id: "japandi", label: "Japandi", hint: "Japonês + escandinavo", colors: ["#efe9df", "#c8b59a", "#8a7056", "#3d3a36"], prompt: "japandi style: blend of Japanese and Scandinavian design, light oak and ash wood, linen, paper lamps, low furniture, muted earthy neutrals, wabi-sabi ceramics" },
  { id: "industrial", label: "Industrial", hint: "Metal, tijolo e concreto", colors: ["#6e6a66", "#2a2826", "#a0522d", "#c8c2b8"], prompt: "industrial style: exposed concrete and brick, black steel, aged leather, exposed ducts and conduits, Edison bulbs, loft character" },
  { id: "escandinavo", label: "Escandinavo", hint: "Claro, aconchegante e funcional", colors: ["#ffffff", "#ece6dc", "#d4b896", "#8fa3a8"], prompt: "scandinavian style: bright white base, light wood, cozy textiles, functional furniture with tapered legs, soft daylight, hygge" },
  { id: "classico", label: "Clássico", hint: "Boiserie, simetria e elegância", colors: ["#f4efe6", "#d9c8a9", "#8b6f47", "#2f2a24"], prompt: "classic style: boiserie wall moldings, symmetry, elegant upholstered furniture, marble, brass details, crystal chandelier, timeless refinement" },
  { id: "rustico", label: "Rústico", hint: "Madeira bruta e pedra", colors: ["#d8c3a5", "#8c6a4f", "#5a4636", "#a8a29a"], prompt: "rustic style: raw solid wood, natural stone, exposed beams, handmade textures, warm and earthy" },
  { id: "boho", label: "Boho", hint: "Fibras, plantas e estampas", colors: ["#f1e4d3", "#c98b5f", "#7d8b5a", "#e3c18d"], prompt: "boho style: natural fibers, rattan and macrame, layered rugs and patterned textiles, many plants, warm terracotta and ochre tones, relaxed and collected" },
  { id: "tropical", label: "Tropical brasileiro", hint: "Madeira, palha e verde", colors: ["#f3eee4", "#7b5a3c", "#3f6b47", "#d9b778"], prompt: "Brazilian tropical modernism: freijó and cumaru wood, cane and straw weaving, cobogó, lush tropical plants, Brazilian design furniture, integration with nature" },
  { id: "luxo", label: "Luxo", hint: "Mármore, metais e iluminação cênica", colors: ["#f5f1ea", "#1c1c1c", "#c9a45c", "#8e8a84"], prompt: "luxury style: book-matched marble, brushed gold and bronze details, lacquer and fluted panels, designer furniture, scenic indirect lighting, high-end five-star feel" },
  { id: "mid-century", label: "Mid-century", hint: "Anos 50 e 60, curvas e nogueira", colors: ["#efe6d6", "#8a5a34", "#d08b3a", "#3f5f5a"], prompt: "mid-century modern style: walnut wood, organic curves, tapered legs, iconic 1950s-60s furniture, mustard, teal and orange accents" },
];

/* ---------- Etapa 5: materiais por superfície ---------- */

export type SurfaceKey = "piso" | "paredes" | "teto" | "marcenaria" | "bancadas" | "metais";

export const SURFACES: { key: SurfaceKey; label: string; promptLabel: string; options: Option[] }[] = [
  {
    key: "piso",
    label: "Piso",
    promptLabel: "Floor",
    options: [
      { id: "porc-branco", label: "Porcelanato branco", swatch: tiles("#f2f1ee", "#d9d7d2"), prompt: "large format polished white porcelain tiles with thin joints" },
      { id: "porc-areia", label: "Porcelanato areia", swatch: tiles("#d9cbb5", "#c4b59e"), prompt: "large format matte sand-beige porcelain tiles with thin joints" },
      { id: "porc-cinza", label: "Porcelanato cinza", swatch: tiles("#b9b8b4", "#a3a29e"), prompt: "large format matte light gray porcelain tiles with thin joints" },
      { id: "porc-grafite", label: "Porcelanato grafite", swatch: tiles("#4a4a4a", "#3a3a3a"), prompt: "large format matte graphite porcelain tiles" },
      { id: "madeira-clara", label: "Madeira clara", swatch: wood("#d8b98f", "#c9a77a", "#e0c49c"), prompt: "light natural oak wide-plank wood floor" },
      { id: "madeira-escura", label: "Madeira escura", swatch: wood("#6b4a33", "#5a3d29", "#7a5740"), prompt: "dark walnut wide-plank wood floor" },
      { id: "vinilico", label: "Vinílico", swatch: wood("#c7ad8a", "#b89c78", "#d1b994"), prompt: "wood-look luxury vinyl plank flooring" },
      { id: "cimento", label: "Cimento queimado", swatch: "radial-gradient(circle at 30% 25%, #a8a7a2, #8c8b86 60%, #7d7c77)", prompt: "seamless burnished concrete floor (cimento queimado) with subtle natural variation" },
      { id: "marmore", label: "Mármore", swatch: stone("#f1efea", "rgba(120,120,120,.35)"), prompt: "polished white Carrara marble floor with soft gray veining" },
      { id: "granilite", label: "Granilite", swatch: "radial-gradient(#7a6a5a 1.5px, transparent 2px) 0 0/9px 9px, radial-gradient(#c79a6e 1.2px, transparent 1.7px) 4px 5px/11px 11px, #ebe6de", prompt: "terrazzo (granilite) floor with light base and small colored stone chips" },
    ],
  },
  {
    key: "paredes",
    label: "Paredes",
    promptLabel: "Walls",
    options: [
      { id: "pint-branco", label: "Pintura branca", swatch: solid("#f7f6f3"), prompt: "smooth matte white painted walls" },
      { id: "pint-offwhite", label: "Off-white", swatch: solid("#ece5d8"), prompt: "smooth matte warm off-white painted walls" },
      { id: "pint-cinza", label: "Cinza claro", swatch: solid("#cfcdc8"), prompt: "smooth matte light warm gray painted walls" },
      { id: "pint-salvia", label: "Verde sálvia", swatch: solid("#a3ad94"), prompt: "smooth matte sage green painted walls" },
      { id: "pint-terracota", label: "Terracota", swatch: solid("#b8694a"), prompt: "smooth matte terracotta painted walls" },
      { id: "pint-azul", label: "Azul petróleo", swatch: solid("#2e4f57"), prompt: "smooth matte deep petrol blue painted walls" },
      { id: "ripado", label: "Ripado de madeira", swatch: "repeating-linear-gradient(90deg, #a9784e 0 7px, #4f3522 7px 9px)", prompt: "vertical wooden slat wall paneling (ripado) in natural wood" },
      { id: "tijolinho", label: "Tijolinho", swatch: "repeating-linear-gradient(0deg, #d9cfc3 0 2px, transparent 2px 13px), repeating-linear-gradient(90deg, #d9cfc3 0 2px, transparent 2px 26px), #b4583a", prompt: "exposed red clay brick wall (tijolinho aparente)" },
      { id: "papel", label: "Papel de parede", swatch: "radial-gradient(circle at 50% 50%, #c9b79c 18%, transparent 20%) 0 0/16px 16px, #ece4d6", prompt: "subtle textured patterned wallpaper" },
      { id: "pedra", label: "Pedra natural", swatch: "radial-gradient(ellipse at 20% 30%, #a39a8c 20%, transparent 22%) 0 0/24px 18px, radial-gradient(ellipse at 70% 70%, #8a8174 18%, transparent 20%) 0 0/20px 16px, #b9b0a2", prompt: "natural stone wall cladding (pedra canjiquinha / stacked stone)" },
      { id: "boiserie", label: "Boiserie", swatch: "linear-gradient(#efede8,#efede8) center/62% 56% no-repeat, linear-gradient(#d6d3cc,#d6d3cc) center/70% 64% no-repeat, #efede8", prompt: "classic boiserie wall moldings painted in the wall color" },
    ],
  },
  {
    key: "teto",
    label: "Teto",
    promptLabel: "Ceiling",
    options: [
      { id: "liso", label: "Liso", swatch: solid("#f6f5f2"), prompt: "smooth flat white plaster ceiling" },
      { id: "sanca", label: "Rebaixado com sanca", swatch: "linear-gradient(180deg, #fff6df 0 18%, #f3f2ef 30%)", prompt: "dropped plaster ceiling with recessed cove (sanca) and indirect warm LED light" },
      { id: "forro-madeira", label: "Forro de madeira", swatch: wood("#c49a6c", "#a87b50", "#d1a877"), prompt: "natural wood slatted ceiling" },
      { id: "concreto", label: "Concreto aparente", swatch: "radial-gradient(circle at 70% 30%, #a3a29d, #8d8c87 70%)", prompt: "exposed board-formed concrete ceiling" },
    ],
  },
  {
    key: "marcenaria",
    label: "Marcenaria e MDF",
    promptLabel: "Cabinetry and joinery (MDF)",
    options: [
      { id: "branco-tx", label: "Branco TX", swatch: solid("#f3f3f1"), prompt: "matte textured white melamine (branco TX)" },
      { id: "amad-claro", label: "Amadeirado claro", swatch: wood("#dcc4a0", "#ccb28b", "#e4cfad"), prompt: "light natural oak wood veneer" },
      { id: "nogueira", label: "Nogueira", swatch: wood("#6f4b33", "#5d3e2a", "#7f5a40"), prompt: "walnut wood veneer" },
      { id: "freijo", label: "Freijó", swatch: wood("#b98d5f", "#a67c50", "#c69b6c"), prompt: "freijó wood veneer (warm golden Brazilian wood)" },
      { id: "grafite", label: "Grafite", swatch: solid("#3c3d3f"), prompt: "matte graphite gray lacquer" },
      { id: "fendi", label: "Fendi", swatch: solid("#c7b9a6"), prompt: "matte fendi (greige) lacquer" },
      { id: "salvia", label: "Verde sálvia", swatch: solid("#9aa68c"), prompt: "matte sage green lacquer" },
      { id: "laca", label: "Laca colorida", swatch: "linear-gradient(135deg, #c8553d, #e4a94b 50%, #2f6c74)", prompt: "glossy colored lacquer in an accent color from the palette" },
    ],
  },
  {
    key: "bancadas",
    label: "Bancadas",
    promptLabel: "Countertops",
    options: [
      { id: "quartzo-branco", label: "Quartzo branco", swatch: "radial-gradient(#e2e2e0 1px, transparent 1.4px) 0 0/6px 6px, #fbfbfa", prompt: "polished white quartz countertop" },
      { id: "granito-preto", label: "Granito preto", swatch: "radial-gradient(#3a3a3a 1px, transparent 1.4px) 0 0/5px 5px, #121212", prompt: "polished absolute black granite countertop (São Gabriel)" },
      { id: "marmore", label: "Mármore", swatch: stone("#f2f0ec", "rgba(110,110,110,.4)"), prompt: "white marble countertop with gray veins" },
      { id: "porcelanato", label: "Porcelanato", swatch: stone("#e9e5de", "rgba(160,150,140,.35)"), prompt: "sintered porcelain slab countertop with thin edge" },
      { id: "madeira", label: "Madeira", swatch: wood("#b98a5e", "#a87b50", "#c49a6c"), prompt: "solid wood countertop" },
    ],
  },
  {
    key: "metais",
    label: "Metais e ferragens",
    promptLabel: "Metals, hardware and fixtures",
    options: [
      { id: "preto", label: "Preto fosco", swatch: metal("#3a3a3a", "#1a1a1a", "#2c2c2c"), prompt: "matte black metals, faucets, handles and hardware" },
      { id: "dourado", label: "Dourado", swatch: metal("#f6e27a", "#b8862b", "#f3d27a"), prompt: "brushed gold metals, faucets, handles and hardware" },
      { id: "inox", label: "Inox", swatch: metal("#f1f3f5", "#9aa1a8", "#e3e6e9"), prompt: "brushed stainless steel metals, faucets, handles and hardware" },
      { id: "cobre", label: "Cobre", swatch: metal("#f0b48a", "#a2552e", "#e59a6f"), prompt: "brushed copper metals, faucets, handles and hardware" },
    ],
  },
];

/** Which surfaces make sense for each room (the rest is hidden from the step). */
export function surfacesForRoom(room: string | null): SurfaceKey[] {
  if (room && EXTERIOR_ROOMS.has(room)) return ["piso", "paredes", "metais"];
  switch (room) {
    case "cozinha":
    case "gourmet":
    case "banheiro":
    case "lavabo":
      return ["piso", "paredes", "teto", "marcenaria", "bancadas", "metais"];
    case "varanda":
      return ["piso", "paredes", "teto", "marcenaria", "bancadas", "metais"];
    default:
      return ["piso", "paredes", "teto", "marcenaria", "metais"];
  }
}

/* ---------- Etapa 6: paleta ---------- */

export const PALETTES: Option[] = [
  { id: "neutra-quente", label: "Neutra quente", colors: ["#f3ede4", "#d9c7ae", "#a88b6a", "#5e4e40"], prompt: "warm neutral palette: cream, beige, sand, warm taupe" },
  { id: "neutra-fria", label: "Neutra fria", colors: ["#f4f5f6", "#d3d6d9", "#8f969c", "#3b4045"], prompt: "cool neutral palette: white, light gray, stone gray, charcoal" },
  { id: "terrosa", label: "Terrosa", colors: ["#e9d8c2", "#c98b5f", "#9b5536", "#5a3a28"], prompt: "earthy palette: clay, terracotta, rust, cinnamon and caramel" },
  { id: "verde-madeira", label: "Verde e madeira", colors: ["#eef0e8", "#a3ad94", "#6b7f5e", "#a77a50"], prompt: "green and wood palette: sage and olive greens with warm natural wood" },
  { id: "preto-branco", label: "Preto e branco", colors: ["#ffffff", "#e5e5e5", "#7a7a7a", "#151515"], prompt: "black and white high-contrast palette" },
  { id: "colorida", label: "Colorida", colors: ["#f2c14e", "#e4572e", "#2e86ab", "#76b041"], prompt: "joyful colorful palette with bold saturated accents balanced by a neutral base" },
];

/* ---------- Etapa 7: luz ---------- */

export const TIMES: Option[] = [
  { id: "manha", label: "Manhã", icon: "Sunrise", swatch: "linear-gradient(160deg, #fdf3d8, #cfe3f2)", prompt: "soft morning daylight, fresh and bright, gentle shadows" },
  { id: "meio-dia", label: "Meio-dia", icon: "Sun", swatch: "linear-gradient(160deg, #ffffff, #bfe0ff)", prompt: "bright midday daylight, crisp and clean" },
  { id: "fim-tarde", label: "Fim de tarde dourado", icon: "Sunset", swatch: "linear-gradient(160deg, #ffd59a, #f08a4b 60%, #8a4b6b)", prompt: "golden hour late afternoon sunlight, warm low sun rays entering through the windows, long soft shadows" },
  { id: "noite", label: "Noite", icon: "Moon", swatch: "linear-gradient(160deg, #1d2440, #0b0f1f 60%, #f6b24e)", prompt: "night scene, dark sky outside the windows, the space lit only by its artificial lights, cozy atmosphere" },
];

export const ARTIFICIAL: Option[] = [
  { id: "fita-led", label: "Fita de LED", icon: "Minus", prompt: "hidden LED strips in niches, shelves and ceiling coves" },
  { id: "pendentes", label: "Pendentes", icon: "Lamp", prompt: "pendant lights" },
  { id: "spots", label: "Spots", icon: "Lightbulb", prompt: "recessed ceiling spotlights" },
  { id: "abajures", label: "Abajures", icon: "Lamp", prompt: "table and floor lamps" },
];

export const TEMPERATURES: Option[] = [
  { id: "quente", label: "Luz quente", swatch: "linear-gradient(135deg, #ffd59a, #ffb766)", prompt: "warm 2700K artificial light" },
  { id: "neutra", label: "Luz neutra", swatch: "linear-gradient(135deg, #fff7e8, #ffe9c4)", prompt: "neutral 3500K artificial light" },
  { id: "fria", label: "Luz fria", swatch: "linear-gradient(135deg, #f2f7ff, #cfe2ff)", prompt: "cool 5000K artificial light" },
];

export const SKIES: Option[] = [
  { id: "limpo", label: "Céu limpo", icon: "Sun", swatch: "linear-gradient(180deg, #5aa7e8, #cfe8ff)", prompt: "clear blue sky" },
  { id: "nublado", label: "Nublado", icon: "CloudSun", swatch: "linear-gradient(180deg, #a9b2bb, #e3e6e9)", prompt: "soft overcast sky with diffuse light" },
  { id: "por-do-sol", label: "Pôr do sol", icon: "Sunset", swatch: "linear-gradient(180deg, #5b4a8a, #f08a4b 60%, #ffd59a)", prompt: "dramatic sunset sky" },
];

/* ---------- Etapa 8: mobiliário ---------- */

export const FURNITURE_MODES: Option[] = [
  { id: "manter", label: "Manter os existentes", icon: "Lock", prompt: "Keep all existing furniture exactly as it is (same pieces, same positions), only render it photorealistically." },
  { id: "trocar", label: "Trocar os móveis", icon: "RotateCcw", prompt: "Replace the existing loose furniture with new pieces in the chosen style, keeping a similar layout and circulation." },
  { id: "adicionar", label: "Adicionar móveis", icon: "Plus", prompt: "Keep the existing furniture and add complementary pieces where there is free space." },
];

export const ITEMS: Option[] = [
  { id: "tapete", label: "Tapete", prompt: "a rug" },
  { id: "plantas", label: "Plantas", prompt: "indoor plants" },
  { id: "quadros", label: "Quadros", prompt: "framed art on the walls" },
  { id: "almofadas", label: "Almofadas", prompt: "cushions and throws" },
  { id: "cortinas", label: "Cortinas", prompt: "linen curtains" },
  { id: "eletro", label: "Eletrodomésticos", prompt: "built-in appliances" },
  { id: "objetos", label: "Objetos decorativos", prompt: "decorative objects, books and vases" },
  { id: "pessoas", label: "Pessoas", prompt: "one or two people naturally using the space, slightly out of focus" },
  { id: "pets", label: "Pets", prompt: "a pet" },
];

/* ---------- Etapa 9: câmera e formato ---------- */

export const ANGLES: Option[] = [
  { id: "original", label: "Manter o ângulo original", icon: "Lock", prompt: "Keep the exact original camera position, height, angle and framing." },
  { id: "frontal", label: "Frontal", icon: "Square", prompt: "Frontal one-point perspective view of the main wall, keeping all architecture identical." },
  { id: "diagonal", label: "Diagonal", icon: "Ratio", prompt: "Two-point perspective diagonal view from a corner, keeping all architecture identical." },
  { id: "superior", label: "Vista superior", icon: "Grid2x2", prompt: "High-angle elevated view looking down into the space, keeping all architecture identical." },
  { id: "detalhe", label: "Detalhe", icon: "Maximize2", prompt: "Close-up detail shot of the main feature of the space with shallow depth of field." },
];

export const FORMATS: { id: string; label: string; hint?: string; ratio: string | null }[] = [
  { id: "original", label: "Original", hint: "Mesma proporção", ratio: null },
  { id: "1:1", label: "1:1", hint: "Quadrado", ratio: "1:1" },
  { id: "4:5", label: "4:5", hint: "Instagram", ratio: "4:5" },
  { id: "9:16", label: "9:16", hint: "Stories", ratio: "9:16" },
  { id: "16:9", label: "16:9", hint: "Apresentação", ratio: "16:9" },
];

export const LENSES: Option[] = [
  { id: "normal", label: "Normal", prompt: "natural 35mm lens, no distortion" },
  { id: "grande-angular", label: "Grande angular", prompt: "wide-angle 18mm architectural lens with corrected verticals" },
];

/* ---------- Qualidade ---------- */

export const QUALITIES = [
  { id: "1k", label: "Padrão 1K", hint: "Rápido, ótimo para testar", credits: 1, seconds: 15 },
  { id: "2k", label: "HD 2K", hint: "Máximo detalhe para apresentar", credits: 3, seconds: 40 },
] as const;

export type QualityId = (typeof QUALITIES)[number]["id"];

/* ---------- Textos fixos do prompt ---------- */

export const PROMPT_BLOCKS = {
  role: "You are a world-class architectural visualization artist. Produce ONE photorealistic image.",
  geometry:
    "GEOMETRY LOCK (highest priority, overrides everything else): preserve exactly the camera position, perspective, vanishing points, horizon line, room shape, wall positions, ceiling height, proportions, and the size and position of every door, window, opening, column, beam, stair and built-in element. Never add, remove, move or resize architectural elements. Straight lines stay straight.",
  quality:
    "QUALITY: indistinguishable from a real photograph taken by a professional architectural photographer for a design magazine. Physically based materials with real texture and scale, accurate reflections and refractions, realistic global illumination and soft contact shadows, balanced exposure, natural color, sharp focus, vertical lines corrected.",
  negativeBase:
    "cartoon, CGI look, plastic materials, video game look, oversaturated colors, blurry, low resolution, warped or curved walls, distorted perspective, duplicated objects, floating furniture, furniture at wrong scale, extra windows or doors, text, letters, logos, watermark, signature, frame, border, split screen, before and after comparison, collage",
  output: "OUTPUT: a single full-bleed image only. No text, no captions, no borders, no side-by-side comparison.",
};
