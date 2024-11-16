import { NextResponse } from "next/server";

function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLogin = request.cookies?.get("isLogin")?.value; // Chuyển đổi thành boolean
  const isAuthPath = pathname.startsWith("/auth");
  const isHomePath = pathname.match(/^\/[bw](\/|$)/) || pathname === "/";

  // Nếu người dùng đã đăng nhập nhưng cố gắng truy cập trang auth, chuyển hướng về home
  if (isLogin === "true" && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Nếu người dùng chưa đăng nhập nhưng cố gắng truy cập trang không phải auth, chuyển hướng về trang login
  if (isLogin === "false" && isHomePath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/:path*"], // Các đường dẫn bắt đầu với /auth, /w, hoặc /b
};
