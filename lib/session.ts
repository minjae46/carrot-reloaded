import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    // cookies() : 브라우저가 서버에게 요청시 header에 담겨 있는 쿠키를 줌.
    // 위에서 받은 쿠키를 바탕으로 iron-session이 아래 쿠키와 같은 이름의 쿠키가 있는지 찾고, 없으면 암호화하여 생성해줌.
    cookieName: "delicious-carrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}
