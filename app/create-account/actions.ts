"use server";
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .min(5, "Way too short!!!")
      .max(10, "That is too looooong!")
      .toLowerCase()
      .trim()
      .refine(
        (username) => !username.includes("potato"),
        "No potatoes allowed!"
      ),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(10)
      .regex(
        passwordRegex,
        "Passwords must contain at least one UPPERCASE, lowercase, number and special characters."
      ),
    confirmPassword: z.string().min(10),
  })
  .refine(({ password, confirmPassword }) => password !== confirmPassword, {
    message: "Two passwords should be equal.",
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
    console.log(result.data);
  }
}
