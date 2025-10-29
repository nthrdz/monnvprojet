import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Pour Next-auth v5, le middleware de protection est géré dans les pages elles-mêmes
  // Ce middleware peut être utilisé pour d'autres logiques si nécessaire
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
