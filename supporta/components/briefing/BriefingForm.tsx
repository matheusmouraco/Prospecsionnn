"use client";

import { Check, LoaderCircle, MessageCircle, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/site";

type Arquivo = { path: string; nome: string; kind: "logo" | "foto" };
type Servico = { nome: string; descricao: string };

const input = "mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-base focus:border-ink focus:outline-none";
const textarea = "mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base focus:border-ink focus:outline-none";

const empty = {
  nomeFantasia: "",
  slogan: "",
  historia: "",
  diferenciais: "",
  publico: "",
  tom: "Próximo e simples",
  perguntas: "",
  endereco: "",
  cidade: "",
  horario: "",
  telefone: "",
  whatsapp: "",
  instagram: "",
  mapa: "",
  temDominio: "",
  dominio: "",
  dominio1: "",
  dominio2: "",
  dominio3: "",
  cores: "",
  referencias: "",
  observacoes: "",
};

function Group({ n, title, hint, children }: { n: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-[2rem] border border-line bg-white p-6 md:p-8">
      <legend className="sr-only">{title}</legend>
      <p className="font-mono text-sm text-graphite">{n}</p>
      <h2 className="mt-2 text-2xl tracking-[-0.04em]">{title}</h2>
      {hint ? <p className="mt-1 text-[15px] text-graphite">{hint}</p> : null}
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ id, label, hint, wide, children }: { id: string; label: string; hint?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <label htmlFor={id} className="text-[15px] font-medium">{label}</label>
      {children}
      {hint ? <p className="mt-1.5 text-sm text-graphite">{hint}</p> : null}
    </div>
  );
}

const cleanDomain = (v: string) => v.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

/** Mensagem do WhatsApp sobre o domínio: quem já tem combina o apontamento; quem não tem manda as opções para a busca no registro.br. */
function domainMessage(r: typeof empty) {
  if (r.temDominio === "sim") {
    return `Oi! Acabei de preencher o briefing da Supporta (${r.nomeFantasia || "minha empresa"}). Já tenho o domínio registrado: ${cleanDomain(r.dominio) || "(vou informar)"}. Como fazemos para apontar para o site?`;
  }
  const opcoes = [r.dominio1, r.dominio2, r.dominio3].map(cleanDomain).filter(Boolean);
  return `Oi! Acabei de preencher o briefing da Supporta (${r.nomeFantasia || "minha empresa"}). Ainda não tenho domínio. Minhas opções, em ordem de preferência: ${opcoes.length ? opcoes.join(", ") : "(vou pensar e mando)"}. Podem ver a disponibilidade no registro.br?`;
}

export function BriefingForm() {
  const [ref, setRef] = useState("");
  const [sig, setSig] = useState("");
  const [r, setR] = useState(empty);
  const [servicos, setServicos] = useState<Servico[]>([{ nome: "", descricao: "" }]);
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [uploading, setUploading] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");
  const [error, setError] = useState("");
  const doneRef = useRef<HTMLDivElement>(null);
  const key = ref ? `supporta-briefing-${ref}` : "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("ref") ?? "";
    const t = params.get("t") ?? "";
    if (!/^sup_[0-9a-f-]{36}$/.test(reference) || !t) {
      setState("invalid");
      return;
    }
    setRef(reference);
    setSig(t);
    try {
      const saved = JSON.parse(localStorage.getItem(`supporta-briefing-${reference}`) ?? "null");
      if (saved?.r) setR({ ...empty, ...saved.r });
      if (saved?.servicos?.length) setServicos(saved.servicos);
      if (saved?.arquivos?.length) setArquivos(saved.arquivos);
    } catch {}
  }, []);

  // Rascunho local: quem fecha a aba no meio não perde o que já escreveu.
  useEffect(() => {
    if (!key || state === "done") return;
    try {
      localStorage.setItem(key, JSON.stringify({ r, servicos, arquivos }));
    } catch {}
  }, [key, r, servicos, arquivos, state]);

  const set = (field: keyof typeof empty) => (e: { target: { value: string } }) => setR((prev) => ({ ...prev, [field]: e.target.value }));

  async function upload(files: FileList | null, kind: "logo" | "foto") {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files).slice(0, kind === "logo" ? 2 : 10);
    for (const file of list) {
      setUploading((n) => n + 1);
      try {
        const res = await fetch("/api/briefing/upload", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ref, t: sig, type: file.type, size: file.size, kind }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Falha no envio.");
        const put = await fetch(data.uploadUrl, { method: "PUT", headers: { "content-type": file.type }, body: file });
        if (!put.ok) throw new Error("Falha ao enviar o arquivo.");
        setArquivos((a) => [...a, { path: data.path, nome: file.name, kind }]);
      } catch (err) {
        setError(`${file.name}: ${(err as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!r.nomeFantasia.trim() || !servicos.some((s) => s.nome.trim())) {
      setError("Preencha pelo menos o nome da empresa e um serviço.");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ref,
          t: sig,
          respostas: {
            ...r,
            diferenciais: r.diferenciais.split("\n").map((l) => l.trim()).filter(Boolean),
            perguntas: r.perguntas.split("\n").map((l) => l.trim()).filter(Boolean),
            dominio: r.temDominio === "sim" ? cleanDomain(r.dominio) : "",
            dominioOpcoes: r.temDominio === "nao" ? [r.dominio1, r.dominio2, r.dominio3].map(cleanDomain).filter(Boolean) : [],
            servicos: servicos.filter((s) => s.nome.trim()),
          },
          arquivos,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não foi possível enviar.");
      setState("done");
      try {
        localStorage.removeItem(key);
      } catch {}
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "invalid") {
    return <p role="alert" className="rounded-3xl bg-pink-light px-6 py-5">Este link de briefing está incompleto. Use o link que enviamos por e-mail ou fale com a gente no WhatsApp.</p>;
  }

  if (state === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} className="rounded-[2rem] bg-ink p-8 text-paper focus:outline-none">
        <Check aria-hidden strokeWidth={1.75} className="h-10 w-10 text-pink" />
        <h2 className="mt-4 text-3xl tracking-[-0.045em]">Briefing recebido.</h2>
        <p className="mt-3 max-w-xl text-mist">A gente começa agora. Você recebe a primeira versão do site para aprovar e acompanha tudo na área do cliente.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/cliente" className={buttonClass("paper", "lg")}>Ir para a área do cliente</a>
          {r.temDominio ? (
            <a href={whatsappUrl(domainMessage(r))} target="_blank" rel="noopener" className={buttonClass("outline-dark", "lg")} data-track="whatsapp_click" data-track-origin="briefing-dominio">
              <MessageCircle aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Combinar o domínio no WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  const logo = arquivos.filter((a) => a.kind === "logo");
  const fotos = arquivos.filter((a) => a.kind === "foto");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Group n="01" title="Sua empresa" hint="Como você quer ser apresentado. Escreva do seu jeito, a gente lapida o texto.">
        <Field id="b-nome" label="Nome da empresa como deve aparecer no site">
          <input id="b-nome" className={input} required value={r.nomeFantasia} onChange={set("nomeFantasia")} />
        </Field>
        <Field id="b-slogan" label="Frase ou slogan (opcional)">
          <input id="b-slogan" className={input} value={r.slogan} onChange={set("slogan")} />
        </Field>
        <Field id="b-historia" label="Conte a história da empresa em poucas linhas" wide>
          <textarea id="b-historia" rows={4} className={textarea} value={r.historia} onChange={set("historia")} />
        </Field>
        <Field id="b-dif" label="Diferenciais (um por linha)" hint="Só o que for verdade e você puder comprovar: tempo de mercado, estrutura, especializações." wide>
          <textarea id="b-dif" rows={3} className={textarea} value={r.diferenciais} onChange={set("diferenciais")} />
        </Field>
      </Group>

      <Group n="02" title="Serviços" hint="Uma linha por serviço. Eles viram seções do site e respostas para o Google e as IAs.">
        <div className="space-y-3 md:col-span-2">
          {servicos.map((s, i) => (
            <div key={i} className="grid gap-3 rounded-2xl bg-paper p-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
              <Field id={`b-s${i}`} label={`Serviço ${i + 1}`}>
                <input id={`b-s${i}`} className={input} value={s.nome} onChange={(e) => setServicos((list) => list.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))} />
              </Field>
              <Field id={`b-sd${i}`} label="Descrição curta (opcional)">
                <input id={`b-sd${i}`} className={input} value={s.descricao} onChange={(e) => setServicos((list) => list.map((x, j) => (j === i ? { ...x, descricao: e.target.value } : x)))} />
              </Field>
              {servicos.length > 1 ? (
                <button type="button" onClick={() => setServicos((list) => list.filter((_, j) => j !== i))} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line" aria-label={`Remover serviço ${i + 1}`}>
                  <Trash2 aria-hidden strokeWidth={1.75} className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ))}
          {servicos.length < 10 ? (
            <button type="button" onClick={() => setServicos((list) => [...list, { nome: "", descricao: "" }])} className={buttonClass("outline", "md")}>
              <Plus aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Adicionar serviço
            </button>
          ) : null}
        </div>
      </Group>

      <Group n="03" title="Seus clientes" hint="Ajuda a escrever do jeito que o seu cliente fala e a aparecer nas perguntas que ele faz às IAs.">
        <Field id="b-publico" label="Quem é o seu cliente ideal?" wide>
          <textarea id="b-publico" rows={2} className={textarea} value={r.publico} onChange={set("publico")} />
        </Field>
        <Field id="b-perguntas" label="Perguntas que os clientes sempre fazem (uma por linha)" hint="Viram o FAQ do site, com as respostas que você nos passar no WhatsApp." wide>
          <textarea id="b-perguntas" rows={4} className={textarea} value={r.perguntas} onChange={set("perguntas")} />
        </Field>
        <Field id="b-tom" label="Tom de voz">
          <select id="b-tom" className={input} value={r.tom} onChange={set("tom")}>
            <option>Próximo e simples</option>
            <option>Sério e técnico</option>
            <option>Acolhedor</option>
            <option>Moderno e direto</option>
          </select>
        </Field>
      </Group>

      <Group n="04" title="Contato e localização">
        <Field id="b-end" label="Endereço completo (se atende no local)" wide>
          <input id="b-end" className={input} autoComplete="street-address" value={r.endereco} onChange={set("endereco")} />
        </Field>
        <Field id="b-cidade" label="Cidade e bairros que atende">
          <input id="b-cidade" className={input} value={r.cidade} onChange={set("cidade")} />
        </Field>
        <Field id="b-horario" label="Horário de funcionamento">
          <input id="b-horario" className={input} placeholder="Seg a sex, 8h às 18h" value={r.horario} onChange={set("horario")} />
        </Field>
        <Field id="b-tel" label="Telefone">
          <input id="b-tel" type="tel" className={input} value={r.telefone} onChange={set("telefone")} />
        </Field>
        <Field id="b-whats" label="WhatsApp do site">
          <input id="b-whats" type="tel" className={input} value={r.whatsapp} onChange={set("whatsapp")} />
        </Field>
        <Field id="b-insta" label="Instagram (opcional)">
          <input id="b-insta" className={input} value={r.instagram} onChange={set("instagram")} />
        </Field>
        <Field id="b-mapa" label="Link do Google Maps (opcional)">
          <input id="b-mapa" className={input} value={r.mapa} onChange={set("mapa")} />
        </Field>
      </Group>

      <Group n="05" title="Domínio e visual" hint="O domínio é o endereço do site, como suaempresa.com.br. A gente cuida dele com você pelo WhatsApp.">
        <fieldset className="md:col-span-2">
          <legend className="text-[15px] font-medium">Você já tem o domínio registrado?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["sim", "Sim, já tenho o domínio registrado"],
              ["nao", "Não tenho o domínio registrado"],
            ].map(([value, label]) => (
              <label key={value} className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 py-2 text-[15px] has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink ${r.temDominio === value ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}>
                <input type="radio" name="temDominio" value={value} checked={r.temDominio === value} onChange={set("temDominio")} className="sr-only" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {r.temDominio === "sim" ? (
          <div className="space-y-3 md:col-span-2">
            <Field id="b-dominio" label="Qual é o domínio?" hint="A gente te chama no WhatsApp para apontar o domínio para o site novo. Você não precisa mexer em nada sozinho.">
              <input id="b-dominio" className={input} inputMode="url" placeholder="suaempresa.com.br" value={r.dominio} onChange={set("dominio")} />
            </Field>
          </div>
        ) : null}
        {r.temDominio === "nao" ? (
          <div className="md:col-span-2">
            <p className="text-[15px] font-medium">Até 3 opções de domínio, em ordem de preferência</p>
            <p className="mt-1 text-sm text-graphite">A gente busca a disponibilidade no registro.br e confirma com você no WhatsApp antes de registrar. O .com.br do 1º ano está incluso e fica no seu CPF ou CNPJ.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {(["dominio1", "dominio2", "dominio3"] as const).map((k, i) => (
                <div key={k}>
                  <label htmlFor={`b-${k}`} className="text-sm text-graphite">Opção {i + 1}</label>
                  <input id={`b-${k}`} className={input} inputMode="url" placeholder={i === 0 ? "suaempresa.com.br" : i === 1 ? "suaempresasp.com.br" : "suaempresa.com"} value={r[k]} onChange={set(k)} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {r.temDominio ? (
          <div className="md:col-span-2">
            <a href={whatsappUrl(domainMessage(r))} target="_blank" rel="noopener" className={buttonClass("outline", "md")} data-track="whatsapp_click" data-track-origin="briefing-dominio">
              <MessageCircle aria-hidden strokeWidth={1.75} className="h-4 w-4" /> {r.temDominio === "sim" ? "Combinar o domínio no WhatsApp" : "Mandar as opções no WhatsApp"}
            </a>
            <p className="mt-2 text-sm text-graphite">Se preferir, é só enviar o briefing: a gente te chama.</p>
          </div>
        ) : null}
        <Field id="b-cores" label="Cores da marca (se tiver)">
          <input id="b-cores" className={input} placeholder="Azul marinho e dourado, ou #123456" value={r.cores} onChange={set("cores")} />
        </Field>
        <Field id="b-ref" label="Sites que você gosta (opcional)" wide>
          <textarea id="b-ref" rows={2} className={textarea} value={r.referencias} onChange={set("referencias")} />
        </Field>
      </Group>

      <Group n="06" title="Logo e fotos" hint="PNG, JPG, WebP, SVG ou PDF, até 10 MB cada. Fotos reais da empresa e da equipe funcionam melhor que banco de imagens.">
        <div>
          <p className="text-[15px] font-medium">Logo</p>
          <label className={buttonClass("outline", "md", "mt-2 cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink")}>
            <Upload aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Enviar logo
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf" className="sr-only" onChange={(e) => upload(e.target.files, "logo")} />
          </label>
          <ul className="mt-3 space-y-1 text-sm text-graphite">{logo.map((a) => <li key={a.path}>✓ {a.nome}</li>)}</ul>
        </div>
        <div>
          <p className="text-[15px] font-medium">Fotos (até 10)</p>
          <label className={buttonClass("outline", "md", "mt-2 cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-pink")}>
            <Upload aria-hidden strokeWidth={1.75} className="h-4 w-4" /> Enviar fotos
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => upload(e.target.files, "foto")} />
          </label>
          <ul className="mt-3 space-y-1 text-sm text-graphite">{fotos.map((a) => <li key={a.path}>✓ {a.nome}</li>)}</ul>
        </div>
        {uploading > 0 ? (
          <p role="status" className="flex items-center gap-2 text-sm md:col-span-2">
            <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> Enviando {uploading} arquivo(s)...
          </p>
        ) : null}
        <p className="text-sm text-graphite md:col-span-2">Prefere mandar depois? Pode enviar pelo WhatsApp também.</p>
      </Group>

      <Group n="07" title="Algo mais?">
        <Field id="b-obs" label="Observações, ideias, o que não pode faltar" wide>
          <textarea id="b-obs" rows={3} className={textarea} value={r.observacoes} onChange={set("observacoes")} />
        </Field>
      </Group>

      {error ? <p role="alert" className="rounded-2xl bg-pink-light px-5 py-3">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={state === "sending" || uploading > 0} className={buttonClass("primary", "lg")}>
          {state === "sending" ? <LoaderCircle aria-hidden strokeWidth={1.75} className="h-4 w-4 animate-spin" /> : null}
          Enviar briefing
        </button>
        <p className="text-sm text-graphite">O que você escreve fica salvo neste navegador até enviar.</p>
      </div>
    </form>
  );
}
