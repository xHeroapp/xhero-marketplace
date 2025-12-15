import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: req.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Public routes
  const publicRoutes = [
    "/login",
    "/auth/callback",
    // "/auth/forgot-password",
    // "/auth/reset-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Protect routes
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  //   we would remove the home page protection since users can login as guests
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Role-based redirects is not needed for now
  //   if (session) {
  //     const role = session.user.user_metadata.role;

  //     if (role === "hr" && pathname.startsWith("/onboarding/employee")) {
  //       return NextResponse.redirect(new URL("/onboarding/hr", req.url));
  //     }

  //     if (role !== "hr" && pathname.startsWith("/onboarding/hr")) {
  //       return NextResponse.redirect(new URL("/onboarding/employee", req.url));
  //     }
  //   }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
