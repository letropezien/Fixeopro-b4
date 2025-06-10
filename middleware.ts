import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirection pour les anciennes URLs admin
  if (pathname === "/admin.php" || pathname === "/wp-admin" || pathname === "/administrator") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Vérification d'accès pour les routes admin
  if (pathname.startsWith("/admin")) {
    // Permettre l'accès à la page de connexion admin
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.next()
    }

    // Pour les autres routes admin, vérifier l'authentification
    const adminAuth = request.cookies.get("admin_authenticated")
    if (!adminAuth || adminAuth.value !== "true") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/administration/:path*", "/admin.php", "/wp-admin", "/administrator"],
}
