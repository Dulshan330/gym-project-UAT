"use client";
import { userAtom } from "@/store/atom";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  children,
  href,
  className,
}) => {
  const [user] = useAtom(userAtom);

  if (!user || !user.roles) {
    return null;
  }

  // Check if user's role has permission for this route
  const hasPermission =
    user.roles.accessPages.includes(href);

  if (!hasPermission) {
    return null;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export default ProtectedLink;
