"use client";
import {
  ActivitySquareIcon,
  LayoutDashboardIcon,
  MessageCircleCodeIcon,
  Settings,
  UserRoundCogIcon,
  Users,
  UserSearchIcon,
  TextSearch,
  Webcam,
  ClipboardCheck,
  ListTree,
  LogOutIcon,
  DumbbellIcon,
  User,
  Loader2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useAtom } from "jotai";
import { userAtom } from "@/store/atom";
import ProtectedLink from "./protected-link/protectedLink";
import { Button } from "./ui/button";
import { logout } from "@/app/actions/logout";
import { useEffect, useState } from "react";
import { getSignedUrl } from "@/app/actions/userManagement";

// Define categorized menu items
const dashboardItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Users", url: "/dashboard/users", icon: UserSearchIcon },
  { title: "Member", url: "/dashboard/members", icon: UserSearchIcon },
  { title: "Workouts", url: "/dashboard/workouts", icon: ClipboardCheck },
  { title: "Transaction", url: "/dashboard/transactions", icon: ListTree },
  {
    title: "Packages",
    url: "/dashboard/packages",
    icon: TextSearch,
  },
  {
    title: "Roles",
    url: "/dashboard/roles",
    icon: Users,
  },
  { title: "Activity Log", url: "#", icon: ActivitySquareIcon },
];

const communicationItems = [
  { title: "Messages", url: "#", icon: MessageCircleCodeIcon },
  { title: "Team", url: "#", icon: Users },
];

const settingsItems = [
  { title: "Access control", url: "#", icon: UserRoundCogIcon },
  { title: "Device Management ", url: "#", icon: Webcam },
  { title: "Settings", url: "#", icon: Settings },
  { title: "Logout", url: "logoutbutton", icon: Settings },
];

const profileItems = [
  { title: "Profile", url: "/profile/view", icon: User },
  { title: "Workout Schedule", url: "/profile/schedule", icon: DumbbellIcon },
];

export function AppSidebar() {
  const [user] = useAtom(userAtom);
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, 15)}...` : text;
  };

  const getProfileImageUrl = async () => {
    try {
      setLoading(true);
      const res = await getSignedUrl(user.imagePath);
      if (res?.signedUrl) {
        setSignedUrl(res?.signedUrl);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileImageUrl();
  }, []);

  return (
    <Sidebar>
      {/* Sidebar Header - Company Logo & Name */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Image
          width={50}
          height={50}
          src="/LOGO.png"
          alt="Company Logo"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">LEGION FITNESS</h2>
          {/* <p className="capitalize text-sm text-gray-400">free plan</p> */}
        </div>
      </div>
      <SidebarContent>
        {/* Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupLabel>DASHBOARD</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ProtectedLink href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </ProtectedLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication Section */}
        <SidebarGroup>
          <SidebarGroupLabel>COMMUNICATION</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ProtectedLink href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </ProtectedLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ProtectedLink href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </ProtectedLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile Section */}
        <SidebarGroup>
          <SidebarGroupLabel>PROFILE</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <ProtectedLink href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </ProtectedLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex space-x-2 px-2 text-sm items-center hover:cursor-pointer">
          <LogOutIcon className="size-6" />
          <Button
            variant={"ghost"}
            className="hover:cursor-pointer"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </SidebarContent>
      <div className="flex items-center gap-3 px-4 py-2 border-t border-gray-200  bg-orange-200 rounded-2xl m-5 mt-auto">
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Image
            src={signedUrl || "/Profile.png"}
            alt={"profile"}
            width={50}
            height={50}
            className="rounded-full aspect-square object-cover"
          />
        )}

        <div className="flex flex-col">
          <span className="font-semibold text-sm capitalize">
            {user.username ? truncateText(user.username, 20) : "Loading..."}
          </span>
          <span className="text-xs text-gray-500">
            {user.email ? truncateText(user.email, 15) : "Loading..."}
          </span>
        </div>
      </div>
    </Sidebar>
  );
}
