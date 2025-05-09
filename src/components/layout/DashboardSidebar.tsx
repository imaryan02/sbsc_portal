import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckSquare,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Upload,
  Users,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  icon?: React.ElementType;
}

const DashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [role, setRole] = useState<UserRole | null>("mentee"); // Default dummy

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !user.id) {
        // User not logged in – use dummy
        setRole("mentee");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data?.role) {
        setRole(data.role as UserRole);
      }
    };

    fetchUserRole();
  }, [user]);

  const menus: Record<UserRole, SidebarMenuConfig[]> = {
    mentee: [
      { title: "Dashboard", href: "/dashboard/mentee", icon: LayoutDashboard },
      { title: "My Projects", href: "/dashboard/mentee/projects", icon: Briefcase },
      { title: "Available Projects", href: "/dashboard/mentee/available-projects", icon: ListChecks },
      { title: "Mentors", href: "/dashboard/mentee/mentors", icon: Users },
      { title: "Take Test", href: "/dashboard/mentee/tests", icon: FileText },
      { title: "Submit Project", href: "/dashboard/mentee/submit", icon: Upload },
      { title: "Feedback", href: "/dashboard/mentee/feedback", icon: MessagesSquare },
    ],
    mentor: [
      { title: "Dashboard", href: "/dashboard/mentor", icon: LayoutDashboard },
      { title: "Student Requests", href: "/dashboard/mentor/requests", icon: Users },
      { title: "Test Creator", href: "/dashboard/mentor/test-creator", icon: FileText },
      { title: "Review Submissions", href: "/dashboard/mentor/submissions", icon: CheckSquare },
      { title: "Give Feedback", href: "/dashboard/mentor/feedback", icon: MessagesSquare },
    ],
    coordinator: [
      { title: "Dashboard", href: "/dashboard/coordinator", icon: LayoutDashboard },
      { title: "All Projects", href: "/dashboard/coordinator/projects", icon: Briefcase },
      { title: "Submission Review", href: "/dashboard/coordinator/submissions", icon: CheckSquare },
      { title: "Feedback Panel", href: "/dashboard/coordinator/feedback", icon: MessagesSquare },
      { title: "Analytics", href: "/dashboard/coordinator/analytics", icon: BarChart3 },
    ],
  };

  const menuItems = role ? menus[role] : [];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const roleTitleMap: Record<UserRole, string> = {
    mentee: " Dashboard",
    mentor: " Dashboard",
    coordinator: " Dashboard",
  };

  const roleIconMap: Record<UserRole, React.ElementType> = {
    mentee: GraduationCap,
    mentor: BookOpen,
    coordinator: Users,
  };

  const RoleIcon = role ? roleIconMap[role] : null;

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        {role && (
          <Link to={`/dashboard/${role}`} className="flex items-center gap-2">
            {RoleIcon && <RoleIcon className="h-6 w-6 text-primary" />}
            <span className="text-lg font-semibold">{roleTitleMap[role]}</span>
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link to={item.href} className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                isActive("/about-us") && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
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
