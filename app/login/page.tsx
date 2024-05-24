"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { logIn } from "./actions";

export default function LogIn() {
  const [state, action] = useFormState(logIn, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with username, email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={[]}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <Button text="Log in" />
        {state?.loggedIn === true ? (
          <span className="text-green-500 font-medium">Welcome Back!</span>
        ) : null}
      </form>
    </div>
  );
}
