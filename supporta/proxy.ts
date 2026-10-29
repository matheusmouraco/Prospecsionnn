import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorization } from "@/lib/admin-auth";

const LEGACY = ["/teleprompter", "/casafirme"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

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
