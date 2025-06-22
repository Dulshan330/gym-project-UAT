"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn } from "@/app/actions/signin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchUserWithAuthenticationID } from "@/app/actions/userManagement";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    setError(null); // Reset error state before submission

    try {
      setLoading(true);
      const { data: userData, error: userError } = await signIn(
        email,
        password
      );

      if (userError) {
        setError(userError || "Invalid credentials. Please try again.");
        return;
      }

      if (!userData?.user.id) {
        return;
      }

      const { data: userRole, error: roleError } =
        await fetchUserWithAuthenticationID(userData?.user.id);

      if (!userRole.roles.type) {
        return;
      }

      if (userRole.isFirstLogin == true) {
        router.push("/login/update-password");
        return;
      }

      if (userRole.roles.accessPages.includes("/dashboard")) {
        router.push("/dashboard");
      } else {
        router.push("/profile");
      }

      if (roleError) {
        setError(roleError.message || "An unknown error occurred.");
        return;
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Password</Label>
          <Input id="password" type="password" required />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Link
              href="/login/forget"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          {loading ? (
            <div className="w-6 h-6 border-4 border-t-white border-gray-600 rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
    </form>
  );
}
