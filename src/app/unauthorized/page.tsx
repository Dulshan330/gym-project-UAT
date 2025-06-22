"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">403 - Unauthorized</h1>
      <p>You don&apos;t have permission to access this page</p>
      <Button
        variant={"default"}
        onClick={() => {
          router.back();
          router.back();
        }}
      >
        Return to your page
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
