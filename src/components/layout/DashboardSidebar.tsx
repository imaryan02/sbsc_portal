
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  GraduationCap, 
  Home, 
  LayoutDashboard, 
  ListChecks, 
  MessagesSquare, 
  Upload, 
  Users,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarMenuConfig {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardSidebarProps {
  role: UserRole;
}

const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<SidebarMenuConfig[]>([]);

  useEffect(() => {
    // Set different menu items based on user role
    if (role === "mentee") {
      setMenuItems([
        {
          title: "Dashboard",
          href: "/dashboard/mentee",
          icon: LayoutDashboard,
        },
        {
          title: "My Projects",
          href: "/dashboard/mentee/projects",
          icon: Briefcase,
        },
        {
          title: "Available Projects",
          href: "/dashboard/mentee/available-projects",
          icon: ListChecks,
        },
        {
          title: "Mentors",
          href: "/dashboard/mentee/mentors",
          icon: Users,
        },
        {
          title: "Take Test",
          href: "/dashboard/mentee/tests",
          icon: FileText,
        },
        {
          title: "Submit Project",
          href: "/dashboard/mentee/submit",
          icon: Upload,
        },
        {
          title: "Feedback",
          href: "/dashboard/mentee/feedback",
          icon: MessagesSquare,
        },
      ]);
    } else if (role === "mentor") {
      setMenuItems([
        {
          title: "Dashboard",
          href: "/dashboard/mentor",
          icon: LayoutDashboard,
        },
        {
          title: "Student Requests",
          href: "/dashboard/mentor/requests",
          icon: Users,
        },
        {
          title: "Test Creator",
          href: "/dashboard/mentor/test-creator",
          icon: FileText,
        },
        {
          title: "Review Submissions",
          href: "/dashboard/mentor/submissions",
          icon: CheckSquare,
        },
        {
          title: "Give Feedback",
          href: "/dashboard/mentor/feedback",
          icon: MessagesSquare,
        },
      ]);
    } else if (role === "coordinator") {
      setMenuItems([
        {
          title: "Dashboard",
          href: "/dashboard/coordinator",
          icon: LayoutDashboard,
        },
        {
          title: "All Projects",
          href: "/dashboard/coordinator/projects",
          icon: Briefcase,
        },
        {
          title: "Submission Review",
          href: "/dashboard/coordinator/submissions",
          icon: CheckSquare,
        },
        {
          title: "Feedback Panel",
          href: "/dashboard/coordinator/feedback",
          icon: MessagesSquare,
        },
        {
          title: "Analytics",
          href: "/dashboard/coordinator/analytics",
          icon: BarChart3,
        },
      ]);
    }
  }, [role]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const roleTitleMap = {
    mentee: "Student Dashboard",
    mentor: "Mentor Dashboard",
    coordinator: "Coordinator Dashboard",
  };

  const roleIconMap = {
    mentee: GraduationCap,
    mentor: BookOpen,
    coordinator: Users,
  };

  const RoleIcon = roleIconMap[role];

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link to={`/dashboard/${role}`} className="flex items-center gap-2">
          <RoleIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">{roleTitleMap[role]}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild className={isActive(item.href) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
                <Link to={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          
          {/* About Us link - visible for all roles */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/about-us") ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}>
              <Link to="/about-us" className="flex items-center gap-3">
                <Info className="h-5 w-5" />
                <span>About Us</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-sidebar-foreground/60">
        <p>© 2025 Mentorship Platform</p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
