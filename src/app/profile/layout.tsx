import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <SidebarTrigger className="absolute" />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProfileLayout;
