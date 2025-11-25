import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // Using PUBLISHABLE_KEY (your actual env var)
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request cookies
          request.cookies.set({
            name,
            value,
            ...options,
          });

          // Update response cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Update request cookies
          request.cookies.set({
            name,
            value: "",
            ...options,
          });

          // Update response cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Get the pathname of the request (e.g. /dashboard)
  const { pathname } = request.nextUrl;

  // Check if the user is authenticated for protected routes
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Protect specific routes - redirect to login if not authenticated
  const protectedRoutes = [
    '/dashboard', '/journal', '/courses', '/analytics', '/calendar',
    '/community', '/learning', '/live', '/portfolio', '/sessions',
    '/settings', '/signals', '/tasks', '/trading', '/workspaces', '/jawgnarl'
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if ((pathname.startsWith("/auth/") || pathname === "/auth") && user) {
    const redirectUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
