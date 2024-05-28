"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const passwordRegex = new RegExp(/^(?=.*\d).+$/);

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username should be at least 2 characters long.")
    .toLowerCase(),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters long.")
    .regex(
      passwordRegex,
      "Password should contain at least one number (0123456789)."
    ),
});

export async function logIn(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten(); // error를 알아보기 쉽게 formating 해줌
  } else {
    return redirect("/");
  }
}
