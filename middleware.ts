
// This is a conceptual file for the Next.js migration.
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  
  // Define allowed domains (localhost, main domain)
  // Updated to katalogo.digital
  const allowedDomains = ["katalogo.digital", "localhost:3000"];
  
  // Check if it's a subdomain
  const isSubdomain = !allowedDomains.some(d => hostname.includes(d)) || hostname.split(".").length > 2;

  if (isSubdomain) {
    // Extract subdomain (e.g., "lojadocarlos" from "lojadocarlos.katalogo.digital")
    const subdomain = hostname.split(".")[0];
    
    // Rewrite the URL to the _sites dynamic route
    return NextResponse.rewrite(new URL(`/_sites/${subdomain}${url.pathname}`, req.url));
  }

  // If it's the main domain "katalogo.digital" or "app.katalogo.digital", rewrite to /app (Admin)
  if (hostname === "katalogo.digital" || hostname === "app.katalogo.digital") {
     return NextResponse.rewrite(new URL(`/app${url.pathname}`, req.url));
  }

  return NextResponse.next();
}
