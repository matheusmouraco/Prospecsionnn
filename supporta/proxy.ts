import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorization } from "@/lib/admin-auth";

const LEGACY = ["/teleprompter", "/casafirme"];

/** Hosts do próprio site da Supporta; qualquer outro é site de cliente (subdomínio ou domínio próprio). */
function clientHost(host: string) {
  const h = host.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  if (!h || h === "supporta.com.br" || h === "www.supporta.com.br" || h === "localhost" || h.endsWith(".vercel.app") || /^\d+\.\d+\.\d+\.\d+$/.test(h)) return null;
  return h;
}

const ANALISE_HOST = "analise.supporta.com.br";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const rawHost = (request.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "");

  // Prévias antes do pagamento: analise.supporta.com.br/nome (mesmo formato do analise.matilab.com.br).
  if (rawHost === ANALISE_HOST) {
    const url = request.nextUrl.clone();
    url.pathname = `/analise${pathname === "/" ? "" : pathname.replace(/\/+$/, "")}`;
    return NextResponse.rewrite(url);
  }

  // Sites dos clientes: nome.supporta.com.br ou domínio próprio apontado para a Vercel.
  const host = clientHost(request.headers.get("host") ?? "");
  if (host) {
    const url = request.nextUrl.clone();
    url.pathname = `/hospedado/${host}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Apps antigos: sempre com barra no fim, como eram servidos na Hostinger.
  if (LEGACY.includes(pathname)) {
    return NextResponse.redirect(new URL(`${pathname}/${search}`, request.url), 308);
  }
  if (LEGACY.some((p) => pathname.startsWith(`${p}/`))) return NextResponse.next();
  // Modelos da vitrine feitos em Next/React exportam pastas com barra no fim (/vitrine/x/pagina/).
  if (pathname.startsWith("/vitrine/")) return NextResponse.next();

  // Resto do site: sem barra no fim (substitui o redirecionamento padrão do Next, desligado no next.config).
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return NextResponse.redirect(new URL(`${pathname.replace(/\/+$/, "")}${search}`, request.url), 308);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdminAuthorization(request.headers.get("authorization"))) {
      return new NextResponse("Acesso restrito.", { status: 401, headers: { "www-authenticate": 'Basic realm="Supporta", charset="UTF-8"' } });
    }
    const res = NextResponse.next();
    res.headers.set("x-robots-tag", "noindex, nofollow");
    return res;
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/|api/|favicon|icon|opengraph-image).*)"] };
