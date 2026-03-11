"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/clients/AuthClient";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Password } from "@/components/ui/password";
import { loginSchema } from "@/validators/auth.schema";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = form.watch("email");
  const password = form.watch("password");
  const router = useRouter();
  const tmpLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (authError) {
      setAuthError(null);
    }
  }, [email, password, authError]);

  const [fetching, setFetching] = useState<boolean>(false);

  async function onSubmit(data: LoginForm) {
    try {
      setFetching(true);
      setAuthError(null);

      await authClient.login(data);

      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid email or password";
      setAuthError(message);
      setFetching(false);
    }
  }

  return (
    <div className="bg-white w-11/12 sm:w-[500px] flex-col rounded-2xl p-8">
      <div className="flex items-center gap-x-3 mb-5">
        <Logo />
        <div
          className="mt-1 font-bold text-3xl cursor-pinter select-none"
          style={{ textShadow: "2px 2px 4px rgba(23, 37, 62,0.5)" }}
        >
          STOCK
        </div>
      </div>
      <h1 className="mb-1">Log in</h1>
      <p className="mb-6 text-gray-500">Continue to Stock</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mb-5">
          {form.formState.errors.root && (
            <p className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Password control={form.control} name="password" label="Password" />
            {authError && (
              <p className="p-0 m-0 text-sm text-destructive">{authError}</p>
            )}
          </div>
          <Link href="/login" className="block">
            Forgot password?
          </Link>

          <Button type="submit" className="w-full" isLoading={fetching}>
            Login
          </Button>
        </form>
      </Form>

      <div className="text-sm flex gap-x-3 text-gray-500">
        <Link href={tmpLink}>Help</Link>
        <Link href={tmpLink}>Privacy</Link>
        <Link href={tmpLink}>Terms</Link>
      </div>
    </div>
  );
}
