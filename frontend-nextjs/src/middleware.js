import { NextResponse } from "next/server";

function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLogin = request.cookies?.get("isLogin")?.value === "true"; // Chuyển đổi trực tiếp sang boolean
  const isAuthPath = pathname.startsWith("/auth");
  const isProtectedPath = /^\/[bw](\/|$)|^\/$/.test(pathname); // Sử dụng regex đơn giản hơn

  if (isLogin && isAuthPath) {
    // Người dùng đã đăng nhập nhưng cố truy cập trang auth
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLogin && isProtectedPath) {
    // Người dùng chưa đăng nhập nhưng cố truy cập trang được bảo vệ
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/:path*"], // Áp dụng middleware cho tất cả các đường dẫn
};
