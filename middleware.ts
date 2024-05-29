import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

// 빠른 검색을 위해 hashmap 알고리즘 적용
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

// 미들웨어로 request를 중간에 가로챌 수 있다.
export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  // user가 로그인 된 상태가 아닌데,
  if (!session.id) {
    // public 아닌 페이지로 가려고 한다면, 홈으로 보냄.
    if (!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  // user가 로그인 된 상태이고,
  else {
    // piublic인 페이지로 가려고 한다면, 리스트 페이지로 보냄.
    if (exists) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }
}

// 미들웨어가 어떤 request에서 실행되고 실행되지 않을지 설정해줌.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
