"use client";
import { updatePassword } from "@/app/actions/signin";
import { fetchUserWithAuthenticationID } from "@/app/actions/userManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const UpdatePasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      password: { value: string };
      confirmPassword: { value: string };
    };
    const password = target.password.value;
    const confirmPassword = target.confirmPassword.value;
    setError(null);

    try {
      setLoading(true);
      if (password !== confirmPassword) {
        setError("Passwords are not matched!");
        return;
      }

      const { data, error } = await updatePassword(password);

      if (!data?.user.id) {
        return;
      }

      if (error) {
        toast.error(`${error}`, {
          style: { background: "red", color: "white" },
        });
        return;
      }

      const { data: userRole } = await fetchUserWithAuthenticationID(
        data?.user.id
      );

      toast.success("Password is updated!", {
        style: { background: "green", color: "white" },
      });

      if (userRole.roles.type == "member") {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          fill
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Change Password</h1>
                <p className="text-balance text-sm text-muted-foreground my-2">
                  Enter your new password below to login to your account
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-t-white border-gray-600 rounded-full animate-spin"></div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
