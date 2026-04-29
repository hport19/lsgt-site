import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // Ignora assets internos de Next
  const isNextAsset =
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/robots.txt") ||
    url.pathname.startsWith("/sitemap");

  if (isNextAsset) return NextResponse.next();

  // Si entra por el subdominio customtunes4u, lo mandamos a la sección
  const isCustomTunesHost = host.toLowerCase().startsWith("customtunes4u.");

  if (isCustomTunesHost) {
    // Evita doble prefijo si ya está en /customtunes4u
    if (!url.pathname.startsWith("/customtunes4u")) {
      const rewriteUrl = url.clone();
      rewriteUrl.pathname = `/customtunes4u${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"], // opcional: evita tocar /api si no quieres
};