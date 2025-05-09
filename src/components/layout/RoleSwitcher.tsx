
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RoleSwitcher = () => {
  const { userRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setIsOpen(false);
    
    // Show a toast notification
    toast({
      title: `Switched to ${role} role`,
      description: `You are now viewing the application as a ${role}.`,
    });
    
    // Navigate to the appropriate dashboard
    navigate(`/dashboard/${role}`);
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "mentee":
        return <GraduationCap className="h-4 w-4 mr-2" />;
      case "mentor":
        return <BookOpen className="h-4 w-4 mr-2" />;
      case "coordinator":
        return <Users className="h-4 w-4 mr-2" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "mentee":
        return "Student";
      case "mentor":
        return "Mentor";
      case "coordinator":
        return "Coordinator";
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-dashed border-primary">
          {userRole && getRoleIcon(userRole)}
          <span>Current Role: <strong>{userRole && getRoleLabel(userRole)}</strong></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background">
        <DropdownMenuItem 
          className="flex items-center cursor-pointer" 
          onClick={() => handleRoleSwitch("mentee")}>
          <GraduationCap className="h-4 w-4 mr-2" />
          <span>Student</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center cursor-pointer" 
          onClick={() => handleRoleSwitch("mentor")}>
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Mentor</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center cursor-pointer" 
          onClick={() => handleRoleSwitch("coordinator")}>
          <Users className="h-4 w-4 mr-2" />
          <span>Coordinator</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
