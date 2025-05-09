
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get session info from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          // Fetch the user's profile to determine their role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            // If the profile doesn't exist yet, but it's not a "not found" error
            console.error("Error fetching profile:", profileError);
          }
          
          // If no profile exists, create one
          if (profileError && profileError.code === 'PGRST116') {
            // Check if there's a role in user metadata
            const userMetadata = data.session.user.user_metadata;
            const role = userMetadata?.role || 'mentee'; // Default role
            
            const { error: createProfileError } = await supabase
              .from('profiles')
              .upsert({ 
                id: data.session.user.id,
                role,
                name: userMetadata?.full_name || data.session.user.email?.split('@')[0],
                created_at: new Date().toISOString()
              });
            
            if (createProfileError) {
              console.error("Error creating profile:", createProfileError);
            }
            
            toast({
              title: "Welcome!",
              description: "Your account has been successfully created.",
            });
            
            // Log the role for debugging
            console.log("Created profile with role:", role);
            navigate(`/dashboard/${role}`);
            return;
          }
          
          // Navigate based on the user's role
          const role = profileData?.role || 'mentee';
          
          // Log the role for debugging
          console.log("Redirecting to dashboard with role:", role);
          
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          
          navigate(`/dashboard/${role}`);
          return;
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message);
        toast({
          title: "Authentication Error",
          description: error.message || "An error occurred during authentication",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <h2 className="text-xl font-semibold text-destructive">Authentication Error</h2>
            <p className="mt-2">{error}</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold">Completing authentication...</h2>
            <div className="mt-4 animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
