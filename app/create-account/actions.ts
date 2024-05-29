"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const passwordRegex = new RegExp(
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
  /^(?=.*\d).+$/
);

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username should be at least 2 characters long.")
      .toLowerCase()
      .trim(),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        (email) => email.includes("google.com"),
        "Only @google.com emails are allowed."
      ),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long.")
      .regex(
        passwordRegex,
        // "Passwords must contain at least one UPPERCASE, lowercase, number and special characters."
        "Password should contain at least one number (0123456789)."
      ),
    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long."),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER; // 첫 번쨰 input에서 에러가 나면 다음 작업으로 넘어가지 않고 바로 중단시킴. (db를 여러번 호출하지 않는 방법)
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "There is an account already registered with that email.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Both passwords should be equal.",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = await formSchema.safeParseAsync(data); // formsSchema 내부에서 async function을 사용하기 때문에 method 변경.
  if (!result.success) {
    return result.error.flatten(); // error를 알아보기 쉽게 formating 해줌
  } else {
    // 패스워드 해싱
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // 유저 생성
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
    });
    redirect("/log-in");
  }
}
