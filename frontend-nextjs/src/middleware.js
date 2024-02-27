import { NextResponse } from "next/server";
function middleware(request) {
  const access_token = request.cookies.get("access_token");

  if (access_token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
export default middleware;
export const config = { matcher: ["/auth/:path*"] };
