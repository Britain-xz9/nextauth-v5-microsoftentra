import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest, NextResponse } from "next/server";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  adminRoute,
  studentRoute,
  devRoute,
} from "./routes";

// initialize next-auth
const { auth } = NextAuth(authConfig);

export default auth(async function proxy(req: NextRequest) {
  const { nextUrl } = req; // extract nextUrl from request

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // if isApiAuthRoute, proceed
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const session = await auth(); // get session
  const isAuthenticated = !!session?.user; // check if user is authenticated
  const role = session?.user?.role; // get user role

  // check users route
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoute);
  const isStudentRoute = nextUrl.pathname.startsWith(studentRoute);
  const isDevRoute = nextUrl.pathname.startsWith(devRoute);

  // if user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // if authenticated user tries to access auth route, redirect to their respective dashboard
  if (isAuthenticated && isAuthRoute) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (role === "student") {
      return NextResponse.redirect(new URL("/student", req.url));
    } else if (role === "dev") {
      return NextResponse.redirect(new URL("/dev", req.url));
    }
  }

  // role-based access control
  if (isAuthenticated) {
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (isStudentRoute && role !== "student") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (isDevRoute && role !== "dev") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // return
  return NextResponse.next();
});

export const config = {
  matcher: [
    // https://clerk.com/docs/references/nextjs/clerk-middleware
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
