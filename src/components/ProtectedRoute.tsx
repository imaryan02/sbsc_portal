
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, isLoading, refreshUserRole } = useAuth();
  const location = useLocation();
  const [verifyingRole, setVerifyingRole] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(userRole);

  useEffect(() => {
    const verifyUserRole = async () => {
      if (!user) {
        setVerifyingRole(false);
        return;
      }
      
      // If we already have a role in context, use it
      if (userRole) {
        setCurrentRole(userRole);
        setVerifyingRole(false);
        return;
      }
      
      // Double-check the role from the database
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching role in ProtectedRoute:", error);
          setCurrentRole(null);
        } else {
          console.log("Verified user role in ProtectedRoute:", data.role);
          setCurrentRole(data.role as UserRole);
          // Force refresh the role in context if it's different
          if (data.role !== userRole) {
            refreshUserRole();
          }
        }
      } catch (err) {
        console.error("Exception in verifyUserRole:", err);
        setCurrentRole(null);
      } finally {
        setVerifyingRole(false);
      }
    };
    
    verifyUserRole();
  }, [user, userRole, refreshUserRole]);

  if (isLoading || verifyingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole)) {
    console.log(`Access denied: User role ${currentRole} not in allowed roles [${allowedRoles.join(', ')}]`);
    // Redirect to the user's dashboard if they don't have the required role
    return <Navigate to={`/dashboard/${currentRole}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
