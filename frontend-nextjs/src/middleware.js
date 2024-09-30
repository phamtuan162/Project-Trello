import { NextResponse } from "next/server";
// import Cookies from "js-cookie";
function middleware(request) {
  const { pathname } = request.nextUrl;
  const access_token = request.cookies.get("access_token");
  const isAuthPath = pathname.startsWith("/auth");
  const isHomePath = pathname.match(/^\/[bw](\/|$)/) || pathname === "/";

  if (access_token && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!access_token && isHomePath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/:path*"],
};
