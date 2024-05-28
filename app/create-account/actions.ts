"use server";

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
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(8, "Password should be at least 8 characters long.")
      .regex(
        passwordRegex,
        // "Passwords must contain at least one UPPERCASE, lowercase, number and special characters."
        "Password should contain at least one number (0123456789)."
      ),
    confirmPassword: z.string().min(8),
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
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten(); // error를 알아보기 쉽게 formating 해줌
  } else {
    return redirect("log-in");
  }
}
