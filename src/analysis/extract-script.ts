// Runs inside the page via page.evaluate(string). Kept as plain JS text on purpose:
// functions compiled by tsx/esbuild carry helpers (__name) that do not exist in the browser.
// Returns DomFacts (see facts.ts).
export const EXTRACT_SCRIPT = String.raw`(() => {
  const txt = (el) => (el && el.textContent ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const attr = (sel, name) => { const el = document.querySelector(sel); return el ? el.getAttribute(name) : null; };
  const abs = (u) => { try { return u ? new URL(u, location.href).href : null; } catch { return null; } };
  const vw = window.innerWidth, vh = window.innerHeight;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0;
  };
  const aboveFold = (el) => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0; };

  const links = Array.from(document.querySelectorAll('a[href]'));
  const href = (a) => (a.getAttribute('href') || '').toLowerCase();
  const isWhats = (a) => /wa\.me|whatsapp\.com|api\.whatsapp/.test(href(a));
  const whatsapp = links.filter(isWhats);
  const tel = links.filter((a) => href(a).startsWith('tel:'));
  const mailto = links.filter((a) => href(a).startsWith('mailto:'));
  // Floating widgets are often not <a>: look for elements whose class/id mentions whatsapp.
  const whatsWidgets = Array.from(document.querySelectorAll('[class*="whats" i],[id*="whats" i]')).filter(visible);
  const contactAboveFold = [...whatsapp, ...tel, ...whatsWidgets].some((el) => visible(el) && aboveFold(el));

  const imgs = Array.from(document.querySelectorAll('img'));
  const imgsNoAlt = imgs.filter((i) => !(i.getAttribute('alt') || '').trim());

  const bodyText = document.body ? document.body.innerText : '';
  const years = [];
  const re = /(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi;
  let m; while ((m = re.exec(bodyText))) years.push(Number(m[1]));

  const phoneMatch = bodyText.match(/\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/);
  const addrMatch = bodyText.match(/(?:Rua|R\.|Avenida|Av\.|Alameda|Travessa|Rodovia|Praça)\s[^\n]{5,90}/i);

  // Logo, in order: <img> with "logo" in src/alt/class/id (or inside an element named logo),
  // inline <svg> named logo or first in the header, CSS background on a logo element,
  // first image in the header, then og:image and apple-touch-icon.
  const logoName = (el) => /logo|brand|marca/i.test([el.getAttribute('src'), el.getAttribute('alt'), el.getAttribute('class'), el.id, el.getAttribute('aria-label')].join(' '));
  const header = document.querySelector('header, [class*="header" i], [id*="header" i], nav');
  const logoImg = imgs.find((i) => logoName(i) || (i.closest('a, div, span') && logoName(i.closest('a, div, span'))));
  const svgToData = (svg) => {
    const clone = svg.cloneNode(true);
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const r = svg.getBoundingClientRect();
    if (!clone.getAttribute('width') && r.width) clone.setAttribute('width', String(Math.round(r.width)));
    if (!clone.getAttribute('height') && r.height) clone.setAttribute('height', String(Math.round(r.height)));
    const markup = new XMLSerializer().serializeToString(clone);
    return markup.length < 60000 ? 'data:image/svg+xml;utf8,' + encodeURIComponent(markup) : null;
  };
  const svgs = Array.from(document.querySelectorAll('svg')).filter((s) => { const r = s.getBoundingClientRect(); return r.width >= 40 && r.height >= 16 && r.top < 300; });
  const logoSvg = svgs.find((s) => logoName(s) || (s.closest('a, div, span') && logoName(s.closest('a, div, span'))))
    || (header ? svgs.find((s) => header.contains(s)) : null);
  const bgUrl = (el) => { const m = getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/); return m ? m[1] : null; };
  const logoBgEl = Array.from(document.querySelectorAll('[class*="logo" i], [id*="logo" i]')).find((el) => bgUrl(el));
  const headerImg = header ? Array.from(header.querySelectorAll('img')).find((i) => i.getBoundingClientRect().width >= 40) : null;
  const logo = abs(logoImg && (logoImg.currentSrc || logoImg.getAttribute('src')))
    || (logoSvg ? svgToData(logoSvg) : null)
    || abs(logoBgEl && bgUrl(logoBgEl))
    || abs(headerImg && (headerImg.currentSrc || headerImg.getAttribute('src')))
    || abs(attr('meta[property="og:image"]', 'content'))
    || abs(attr('link[rel*="apple-touch-icon"]', 'href'));

  // Brand colors: CSS custom properties on :root plus area-weighted computed colors.
  const cssVars = {};
  for (const sheet of Array.from(document.styleSheets)) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of Array.from(rules || [])) {
      if (!rule.style || !/:root|html/.test(rule.selectorText || '')) continue;
      for (const name of Array.from(rule.style)) {
        if (!name.startsWith('--')) continue;
        const v = rule.style.getPropertyValue(name).trim();
        if (/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(v)) cssVars[name] = v;
      }
    }
  }
  const toHex = (c) => {
    const p = c.match(/rgba?\(([^)]+)\)/); if (!p) return null;
    const [r, g, b, a] = p[1].split(',').map((x) => parseFloat(x));
    if (a !== undefined && a < 0.5) return null;
    const q = (n) => Math.min(255, Math.round(n / 16) * 16);
    return '#' + [q(r), q(g), q(b)].map((n) => n.toString(16).padStart(2, '0')).join('');
  };
  const weights = {};
  for (const el of Array.from(document.querySelectorAll('body *')).slice(0, 4000)) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const bg = toHex(s.backgroundColor);
    if (bg) weights[bg] = (weights[bg] || 0) + Math.min(r.width * r.height, vw * vh);
    const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
    const fg = own ? toHex(s.color) : null;
    if (fg) weights[fg] = (weights[fg] || 0) + parseFloat(s.fontSize) * txt(el).length * 20;
  }
  const colors = Object.entries(weights).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c);

  const font = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily : null; };
  const headings = Array.from(document.querySelectorAll('h1,h2,h3')).filter(visible).map(txt).filter(Boolean);
  const paragraphs = Array.from(document.querySelectorAll('p')).filter(visible).map(txt).filter((t) => t.length > 40);
  // Reusable photos: large <img> (including lazy data-src/srcset) and large CSS background images.
  const lazySrc = (i) => i.currentSrc || i.getAttribute('data-src') || i.getAttribute('data-lazy-src')
    || ((i.getAttribute('srcset') || i.getAttribute('data-srcset') || '').split(',').pop() || '').trim().split(' ')[0] || i.getAttribute('src');
  const bigImgs = imgs.filter((i) => i !== logoImg && i !== headerImg && (i.naturalWidth >= 600 || i.getBoundingClientRect().width >= 300));
  const bgPhotos = Array.from(document.querySelectorAll('body *')).slice(0, 4000).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width >= 300 && r.height >= 200 && bgUrl(el) && !/\.svg|gradient/i.test(bgUrl(el) || '');
  }).map((el) => bgUrl(el));
  const photos = [...bigImgs.map(lazySrc), ...bgPhotos].map(abs).filter((u) => u && !u.startsWith('data:'));

  // schema.org types from JSON-LD (including @graph) and microdata.
  const ldTypes = [];
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    const t = n['@type'];
    if (t) (Array.isArray(t) ? t : [t]).forEach((x) => ldTypes.push(String(x)));
    if (n['@graph']) walk(n['@graph']);
  };
  for (const s of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
    try { walk(JSON.parse(s.textContent || '')); } catch {}
  }
  for (const el of Array.from(document.querySelectorAll('[itemtype]'))) {
    const t = (el.getAttribute('itemtype') || '').split('/').pop();
    if (t) ldTypes.push(t);
  }
  const faqHeading = Array.from(document.querySelectorAll('h1,h2,h3,h4,summary,button'))
    .some((el) => /perguntas frequentes|d[uú]vidas frequentes|faq/i.test(txt(el)));
  // Controls an AI agent cannot identify: no visible text, aria-label, title or alt on an inner image.
  const nameless = Array.from(document.querySelectorAll('a[href],button,[role="button"],input[type="submit"],input[type="button"]'))
    .filter(visible)
    .filter((el) => {
      const label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('value') || '').trim();
      const imgAlt = Array.from(el.querySelectorAll('img[alt]')).some((i) => (i.getAttribute('alt') || '').trim());
      return !txt(el) && !label && !imgAlt && !el.getAttribute('aria-labelledby');
    }).length;

  return {
    url_final: location.href,
    dados_estruturados: Array.from(new Set(ldTypes)),
    tem_faq: faqHeading || ldTypes.includes('FAQPage'),
    controles_sem_nome: nameless,
    texto_renderizado_chars: (bodyText || '').replace(/\s+/g, ' ').trim().length,
    title: document.title ? document.title.trim() : null,
    meta_description: (attr('meta[name="description"]', 'content') || '').trim() || null,
    h1: Array.from(document.querySelectorAll('h1')).map(txt).filter(Boolean),
    tem_viewport: !!document.querySelector('meta[name="viewport"]'),
    lang: document.documentElement.getAttribute('lang'),
    imagens: imgs.length,
    imagens_sem_alt: imgsNoAlt.length,
    links_whatsapp: whatsapp.length + whatsWidgets.length,
    links_telefone: tel.length,
    links_email: mailto.length,
    contato_visivel_na_dobra: contactAboveFold,
    formularios: document.querySelectorAll('form').length,
    anos_copyright: years,
    tem_favicon: !!document.querySelector('link[rel*="icon"]'),
    og_title: attr('meta[property="og:title"]', 'content'),
    og_image: abs(attr('meta[property="og:image"]', 'content')),
    rolagem_horizontal: document.documentElement.scrollWidth > vw + 2,
    fonte_corpo_px: document.body ? parseFloat(getComputedStyle(document.body).fontSize) : null,
    altura_pagina: document.documentElement.scrollHeight,
    marca: {
      logo_url: logo,
      cores: colors,
      variaveis_css: cssVars,
      fonte_titulo: font('h1') || font('h2'),
      fonte_corpo: font('body'),
      titulos: headings.slice(0, 20),
      paragrafos: paragraphs.slice(0, 8).map((t) => t.slice(0, 400)),
      telefone: phoneMatch ? phoneMatch[0] : null,
      endereco: addrMatch ? addrMatch[0].trim() : null,
      fotos: Array.from(new Set(photos)).slice(0, 16),
    },
  };
})()`;
