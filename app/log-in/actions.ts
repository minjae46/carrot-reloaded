"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // if(user){
  //   return true
  // } else {
  //   return false
  // }
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist."),
  password: z.string(),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // 유효성 검사에서 오류가 없으면 아래 코드가 실행됨.
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx" // user! 일때는 user값이 확실하게 존재한다는 의미.
      // if 패스워드값이 null이면, "xxxx"와 해시값을 비교하라.
    );
    if (ok) {
      // 유저 정보로 쿠키 만들기
      const session = await getSession();
      session.id = user!.id; // 사용자에게 '너는 id 1번이야' 라고 하는 쿠키를 만들어 주는 것.
      await session.save();
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      };
    }
  }
}
