import { NextResponse } from "next/server";

function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLogin = request.cookies.get("isLogin"); // Kiểm tra xem cookie có tồn tại không

  const isAuthPath = pathname.startsWith("/auth");
  const isHomePath = pathname.match(/^\/[bw](\/|$)/) || pathname === "/";
  if (isLogin && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isLogin && isHomePath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/:path*"],
};
