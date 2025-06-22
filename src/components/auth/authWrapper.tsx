"use client";
import { getUser } from "@/app/actions/signin";
import { fetchUserWithAuthenticationID } from "@/app/actions/userManagement";
import { userAtom } from "@/store/atom";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../loader";
import { publicRoutes } from "@/types/publicRoutes";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const isPublic = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isPublic) {
      setIsLoading(false);
      return;
    }

    const getUserInfo = async () => {
      try {
        setIsLoading(true);
        const { data: authData, error } = await getUser();

        if (error || !authData?.user?.id) {
          router.push("/login");
          return;
        }

        const res = await fetchUserWithAuthenticationID(authData.user.id);

        if (res.data) {
          const userRole = res.data;
          // Parse accessPages if it's a stringified array
          const accessPages = Array.isArray(userRole.roles.accessPages)
            ? userRole.roles.accessPages
            : JSON.parse(userRole.roles.accessPages || "[]");
          // Save to userAtom or your user state
          setUser({
            ...userRole,
            roles: {
              ...userRole.roles,
              accessPages,
            },
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, [pathname, router]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
