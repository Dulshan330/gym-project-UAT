"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/app/actions/signin";
import { useRouter } from "next/navigation";

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
    };
    const email = target.email.value;
    setError(null);
    setSuccess(null);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
        return;
      }
      setSuccess("Password reset email sent successfully.");
      router.push("/login/reset");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Please enter your email to reset the password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </div>
    </form>
  );
}
