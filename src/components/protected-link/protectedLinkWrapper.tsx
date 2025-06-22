"use client";
import { userAtom } from "@/store/atom";
import { publicRoutes } from "@/types/publicRoutes";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectedLinkWrapperProps {
  children: React.ReactNode;
}

const ProtectedLinkWrapper: React.FC<ProtectedLinkWrapperProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const isPublic = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isPublic) return;

    if (!user.id) {
      return;
    }

    // Check if current route is allowed for user's role
    const allowedRoutes = user.roles?.accessPages || [];
    const isRouteAllowed = allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!isRouteAllowed) {
      router.push("/unauthorized");
    }
  }, [pathname, user.id, router, user.roles?.accessPages]);

  return <>{children}</>;
};

export default ProtectedLinkWrapper;
