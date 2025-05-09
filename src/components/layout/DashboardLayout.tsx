import { ReactNode, useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/lib/types";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>("mentee"); // Default fallback

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setUserName(data.name || "");
        setRole((data.role as UserRole) || "mentee"); // Safe cast with fallback
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* <DashboardSidebar role={role} /> */}
        <DashboardSidebar />

        <div className="flex-1 flex flex-col">
          <DashboardHeader userName={userName} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-muted/20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
