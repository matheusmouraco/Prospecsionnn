// Shape returned by EXTRACT_SCRIPT for one viewport.
export interface Marca {
  logo_url: string | null;
  cores: string[];
  variaveis_css: Record<string, string>;
  fonte_titulo: string | null;
  fonte_corpo: string | null;
  titulos: string[];
  paragrafos: string[];
  telefone: string | null;
  endereco: string | null;
  fotos: string[];
}

export interface DomFacts {
  url_final: string;
  dados_estruturados: string[];
  tem_faq: boolean;
  controles_sem_nome: number;
  texto_renderizado_chars: number;
  title: string | null;
  meta_description: string | null;
  h1: string[];
  tem_viewport: boolean;
  lang: string | null;
  imagens: number;
  imagens_sem_alt: number;
  links_whatsapp: number;
  links_telefone: number;
  links_email: number;
  contato_visivel_na_dobra: boolean;
  formularios: number;
  anos_copyright: number[];
  tem_favicon: boolean;
  og_title: string | null;
  og_image: string | null;
  rolagem_horizontal: boolean;
  fonte_corpo_px: number | null;
  altura_pagina: number;
  marca: Marca;
}

export type Acesso =
  | { status: 'ok'; https: boolean; url_final: string }
  | { status: 'redireciona_terceiro'; https: boolean; url_final: string }
  | { status: 'erro_ssl'; detalhe: string; url_final: string | null }
  | { status: 'fora_do_ar'; detalhe: string };

export interface Prints {
  desktop_dobra: string;
  desktop_inteira: string;
  mobile_dobra: string;
  mobile_inteira: string;
  desktop_resumo: string; // shorter crop sent to Claude
}

export interface Captura {
  acesso: Acesso;
  desktop: DomFacts | null;
  mobile: DomFacts | null;
  prints: Prints | null;
}
