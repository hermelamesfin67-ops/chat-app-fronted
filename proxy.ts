import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
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

const publicPaths = [
  routes.signIn,
  routes.signOut,
  routes.signUp,
  routes.error,
];

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;

    // Public auth pages
    if (publicPaths.includes(pathname)) {
      return NextResponse.next();
    }

    // Block suspicious paths
    if (blockedPaths.some((path) => pathname.startsWith(path))) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (pathname.startsWith("/_") || pathname.includes("cgi")) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: routes.signIn,
      signOut: routes.signOut,
      error: routes.error,
    },

    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Auth pages don't require a token
        if (publicPaths.includes(pathname)) {
          return true;
        }

        // Every other page requires authentication
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|env-config.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)",
  ],
};
