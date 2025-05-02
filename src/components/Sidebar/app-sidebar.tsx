import * as React from "react";
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  CircleCheck,
  House,
  ScrollText,
  CalendarRange,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/authContext";
import { NavProjects } from "./nav-projects";
import { Skeleton } from "../ui/skeleton";
import CustomSkeleton from "../ui/custom-skeleton";

// This is sample data.
const data = {
  user: {
    name: "tmyridis",
    email: "thmyridis@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: House,
      isActive: true,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: ScrollText,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CircleCheck,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: CalendarRange,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  return (
    <>
      {user !== undefined ? (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navMain} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
          {/* <SidebarRail /> */}
        </Sidebar>
      ) : (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <div className="flex justify-center items-center gap-x-1 w-full">
              <div className="space-y-2 w-full">
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <CustomSkeleton />
          </SidebarContent>
          <SidebarFooter>
            <div className="flex justify-center items-center gap-x-1 w-full">
              <div className="space-y-2 w-full">
                <Skeleton className="h-10 w-full mb-2" />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  );
}
