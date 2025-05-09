import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  userName?: string | null;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && data?.role) {
        setRole(data.role.charAt(0).toUpperCase() + data.role.slice(1));
      }
    };

    fetchRole();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth"); // ✅ Redirect after logout
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
      {/* Sidebar toggle (mobile) */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <span className="material-icons">menu</span>
        </Button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <a href="/auth">
              <Button variant="outline">Login</Button>
            </a>
            <a href="/auth">
              <Button>Signup</Button>
            </a>
          </>
        ) : (
          <>
            {userName && (
              <div className="text-sm text-gray-700">
                Welcome, <span className="font-medium text-black">{userName}</span>
              </div>
            )}
            {role && (
              <div className="px-4 py-1 border rounded text-sm font-medium text-gray-700">
                Current Role: <span className="font-semibold text-blue-600">{role}</span>
              </div>
            )}
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
