"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Image from "next/image";

const VerifyEmailPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-2xl py-20">
        <CardContent className="space-y-5">
          <div className="flex justify-center">
            <Image src={"/check-mark.png"} alt="Image" width={80} height={80} />
          </div>
          <div className="flex justify-center">
            <p className="text-2xl font-semibold">Successful!</p>
          </div>
          <div className="flex justify-center">
            <p className="text-base">Your email is successfully verified!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
