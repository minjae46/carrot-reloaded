"use server";

export async function logIn(prevState: any, formData: FormData) {
  const password = formData.get("password");
  if (password === "12345") {
    return { loggedIn: true };
  }
  return { errors: ["Wrong password"] };
}
