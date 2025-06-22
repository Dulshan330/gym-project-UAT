import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/login.png"
          alt="Image"
          width={1000}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col items-center gap-2 text-center">
              <Image
                src="/Successmark.png"
                width={100}
                height={100}
                alt="Image"
              ></Image>
              <h1 className="text-2xl font-bold">Successful</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Congratulations! Your password has been changed. Click
                <Link href="/login" className="underline underline-offset-4">
                  <span> continue </span>
                </Link>
                to login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
