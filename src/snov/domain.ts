// Hosts that are not a company's own website: social networks, link-in-bio pages,
// marketplaces, generic email providers, shorteners and Google profile pages.
const IGNORED_DOMAINS = [
  // social and messaging
  'instagram.com', 'facebook.com', 'fb.com', 'fb.me', 'linkedin.com', 'twitter.com', 'x.com',
  'tiktok.com', 'youtube.com', 'youtu.be', 'pinterest.com', 'threads.net', 'wa.me',
  'whatsapp.com', 'telegram.me', 't.me', 'kwai.com',
  // link-in-bio and scheduling
  'linktr.ee', 'beacons.ai', 'bio.link', 'taplink.cc', 'linkme.bio', 'campsite.bio', 'calendly.com',
  // generic email providers
  'gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com', 'yahoo.com',
  'yahoo.com.br', 'icloud.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br',
  // Google profiles and shorteners
  'google.com', 'goo.gl', 'g.page', 'business.site', 'bit.ly', 'tinyurl.com', 'cutt.ly',
  // marketplaces and directories
  'mercadolivre.com.br', 'mercadolibre.com', 'shopee.com.br', 'amazon.com.br', 'amazon.com',
  'magazineluiza.com.br', 'magalu.com', 'americanas.com.br', 'olx.com.br', 'elo7.com.br',
  'aliexpress.com', 'ifood.com.br', 'rappi.com.br', 'booking.com', 'airbnb.com', 'airbnb.com.br',
  'tripadvisor.com', 'tripadvisor.com.br', 'doctoralia.com.br', 'reclameaqui.com.br',
  'hotmart.com', 'kiwify.com.br', 'getninjas.com.br', 'guiamais.com.br', 'apontador.com.br',
];

// Lowercase hostname without www, path, port or protocol. Returns null when the
// input cannot be a public website (empty, no dot, IP address, localhost).
export function normalizeDomain(input: string | null | undefined): string | null {
  const raw = (input ?? '').trim();
  if (!raw) return null;
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`;
  let host: string;
  try {
    host = new URL(withProtocol).hostname.toLowerCase();
  } catch {
    return null;
  }
  host = host.replace(/\.+$/, '').replace(/^www\d*\./, '');
  if (!host.includes('.') || host === 'localhost') return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) return null;
  return host;
}

// Franchise-sales subdomains (franquia.marca.com.br) are not the business's own site.
const FRANCHISE_SUBDOMAIN = /^(franquia|franquias|franqueado|franqueados|seja-?franqueado|franchising|franchise)\./;

export function isFranchiseDomain(domain: string): boolean {
  return FRANCHISE_SUBDOMAIN.test(domain);
}

export function isIgnoredDomain(domain: string): boolean {
  if (isFranchiseDomain(domain)) return true;
  return IGNORED_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}
