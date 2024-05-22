"use server";

export async function handleForm(prevState: any, formData: FormData) {
  const password = formData.get("password");
  if (password === "12345") {
    return { logedIn: true };
  }
  return { errors: ["Wrong password"] };
}
