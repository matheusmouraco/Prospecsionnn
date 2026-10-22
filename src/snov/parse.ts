// Maps a raw prospect from /v1/prospect-list to our shape. The docs only show `id`, name
// fields and `emails[]` for sure, so every other field is looked up under several names.
// Run `npm run snov:inspect` on a real list to see the actual keys.

export interface SnovProspect {
  snovId: string;
  email: string;
  emailVerified: boolean | null;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  companyName: string | null;
  website: string | null;
  city: string | null;
}

type Raw = Record<string, unknown>;

const WEBSITE_KEYS = ['companySite', 'company_site', 'companyWebsite', 'company_website', 'website', 'site', 'Company Website', 'domain', 'companyDomain'];
const POSITION_KEYS = ['position', 'jobTitle', 'job_title', 'job', 'title', 'currentJob'];
const COMPANY_KEYS = ['companyName', 'company_name', 'company', 'currentCompany'];
const CITY_KEYS = ['locality', 'city', 'location'];

function str(v: unknown): string | null {
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'number') return String(v);
  return null;
}

function pick(obj: Raw | undefined, keys: string[]): string | null {
  if (!obj) return null;
  for (const k of keys) {
    const v = str(obj[k]);
    if (v) return v;
  }
  return null;
}

function asObject(v: unknown): Raw | undefined {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Raw) : undefined;
}

// Custom fields may come as an object, as an array of {name, value} or as customField_<Name> keys.
function customFields(raw: Raw): Raw {
  const out: Raw = {};
  const cf = raw.customFields;
  if (Array.isArray(cf)) {
    for (const item of cf) {
      const o = asObject(item);
      const name = str(o?.name ?? o?.label ?? o?.key);
      if (name) out[name] = o?.value;
    }
  } else if (asObject(cf)) {
    Object.assign(out, cf);
  }
  for (const [k, v] of Object.entries(raw)) {
    if (k.startsWith('customField_')) out[k.slice('customField_'.length)] = v;
  }
  return out;
}

const CUSTOM_WEBSITE_KEYS = ['Company Website', 'Website', 'Site', 'company website', 'website', 'site'];

function firstJob(raw: Raw): Raw | undefined {
  const jobs = raw.currentJob ?? raw.currentJobs ?? raw.jobs;
  if (Array.isArray(jobs)) return asObject(jobs[0]);
  return asObject(jobs);
}

function bestEmail(raw: Raw): { email: string; verified: boolean | null } | null {
  const list = Array.isArray(raw.emails) ? raw.emails : [];
  const candidates = list
    .map((e) => {
      const o = asObject(e);
      const email = str(o ? o.email : e)?.toLowerCase();
      if (!email || !email.includes('@')) return null;
      const status = str(o?.emailStatus ?? o?.status)?.toLowerCase();
      const verified = o?.isVerified === true || status === 'valid' ? true : status === 'not valid' || status === 'invalid' ? false : null;
      return { email, verified };
    })
    .filter((e): e is { email: string; verified: boolean | null } => e !== null && e.verified !== false);

  const single = str(raw.email)?.toLowerCase();
  if (single?.includes('@')) candidates.push({ email: single, verified: null });

  return candidates.find((c) => c.verified === true) ?? candidates[0] ?? null;
}

export function parseProspect(raw: Raw): SnovProspect | null {
  const email = bestEmail(raw);
  if (!email || raw.id === undefined || raw.id === null) return null;

  const job = firstJob(raw);
  const companyObj = asObject(raw.company);
  const custom = customFields(raw);

  let firstName = str(raw.firstName ?? raw.first_name);
  let lastName = str(raw.lastName ?? raw.last_name);
  const fullName = str(raw.name);
  if (!firstName && fullName) {
    const [first, ...rest] = fullName.split(/\s+/);
    firstName = first ?? null;
    lastName ??= rest.join(' ') || null;
  }

  return {
    snovId: String(raw.id),
    email: email.email,
    emailVerified: email.verified,
    firstName,
    lastName,
    position: pick(raw, POSITION_KEYS.filter((k) => k !== 'currentJob')) ?? pick(job, ['position', 'title', 'jobTitle']),
    companyName:
      pick(raw, COMPANY_KEYS.filter((k) => k !== 'company' || !companyObj)) ?? pick(companyObj, ['name']) ?? pick(job, ['companyName', 'company']),
    website:
      pick(raw, WEBSITE_KEYS) ??
      pick(companyObj, ['site', 'website', 'url', 'domain']) ??
      pick(job, ['site', 'companySite', 'website', 'url']) ??
      pick(custom, CUSTOM_WEBSITE_KEYS),
    city: pick(raw, CITY_KEYS),
  };
}
