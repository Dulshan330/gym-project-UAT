'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPasswordVerify } from "@/app/actions/signin"
import { useRouter } from 'next/navigation'


export function SetNewPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      password: { value: string }
      confirmPassword: { value: string }
    }
    const password = target.password.value
    const confirmPassword = target.confirmPassword.value

    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      const { error } = await resetPasswordVerify(password)
      if (error) {
        setError(error.message)
        return
      }
      setSuccess('Password updated successfully.')
      router.push('/login/reset_success')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Create a new password. Ensure it differs from previous ones for security.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" placeholder="Enter new password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <Input id="confirmPassword" type="password" placeholder="Re-enter new password" required />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </div>
    </form>
  )
}