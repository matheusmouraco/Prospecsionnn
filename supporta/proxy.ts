import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthorization } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  if (isAdminAuthorization(request.headers.get("authorization"))) {
    const res = NextResponse.next();
    res.headers.set("x-robots-tag", "noindex, nofollow");
    return res;
  }
  return new NextResponse("Acesso restrito.", { status: 401, headers: { "www-authenticate": 'Basic realm="Supporta", charset="UTF-8"' } });
}

export const config = { matcher: ["/admin/:path*", "/admin"] };
