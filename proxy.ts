import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { routes } from "@/lib/routes";

const blockedPaths = [
  "/servers",
  "/webdata",
  "/phpnuke",
  "/path",
  "/cm",
  "/cgi-shi",
  "/_vti_adm",
  "/_mmserverscripts",
];

// Define the excluded paths
const excludedPaths = [routes.signIn, routes.signOut, routes.error];

// Custom middleware to exclude paths from auth

export default withAuth(
  async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Skip middleware for excluded paths
    if (excludedPaths.includes(pathname)) {
      return NextResponse.next();
    }

    const session = await getServerSession();

    if (!session) {
      return NextResponse.redirect("/auth/signin");
    }

    if (blockedPaths.some((path) => pathname.startsWith(path))) {
      return new NextResponse("Not Found", { status: 404 });
    }
    if (pathname.startsWith("/_") || pathname.includes("cgi")) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Proceed with auth logic
    return NextResponse.next();
  },
  {
    pages: {
      signIn: routes.signIn,
      signOut: routes.signOut,
      error: routes.error,
    },

    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    {
      source: "/((?!env-config.js|auth/forgot-password|_next/|favicon.ico).*)",
    },
  ],
};
