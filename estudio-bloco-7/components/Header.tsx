'use client';

import { useEffect, useState } from 'react';
import { site, whatsappUrl } from '@/lib/data';

const nav = [
  { href: '#projetos', label: 'Projetos', n: '01' },
  { href: '#manifesto', label: 'Manifesto', n: '02' },
  { href: '#servicos', label: 'Serviços', n: '03' },
  { href: '#contato', label: 'Contato', n: '04' },
];

function useSaoPauloClock() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Header() {
  const time = useSaoPauloClock();
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-paper">
      <div className="wrap">
        <div className="g h-12 items-center">
          <a href="#topo" className="c col-span-2 md:col-span-3 flex items-center gap-2.5" aria-label="Estúdio Bloco 7, voltar ao topo">
            <Mark />
            <span className="label font-medium">Bloco 7</span>
          </a>
          <nav className="hidden md:flex col-span-6 c gap-0" aria-label="Seções">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="label w-1/4 flex gap-1.5 group">
                <span className="text-mute">{item.n}</span>
                <span className="link-u">{item.label}</span>
              </a>
            ))}
          </nav>
          <p className="hidden md:block label c col-span-3 text-right tabular-nums">
            São Paulo <span className="text-mute">{time}</span>
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden label c col-span-2 text-right"
          >
            <span className="link-u">WhatsApp</span> <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
      <div className="wrap">
        <div className="rule draw-x" style={{ '--d': '0.2s' } as React.CSSProperties} aria-hidden />
      </div>
      <span className="sr-only">{site.name}</span>
    </header>
  );
}

/** Logo: a stack of three blocks, the seventh course in the accent color. */
function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="shrink-0">
      <rect x="0" y="0" width="22" height="6" fill="#000" />
      <rect x="0" y="8" width="14" height="6" fill="#000" />
      <rect x="16" y="8" width="6" height="6" fill="#b3460f" />
      <rect x="8" y="16" width="14" height="6" fill="#000" />
    </svg>
  );
}
