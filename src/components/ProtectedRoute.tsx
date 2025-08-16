import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import AdminLogin from './AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Get current session with better error handling
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setLoading(false);
            setShowLoginModal(true);
          }
          return;
        }

        if (session?.user) {
          console.log('Found existing session for user:', session.user.email);
          
          // Check if user has admin role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (mounted) {
            if (profileError) {
              console.error('Profile fetch error:', profileError);
              // If profile doesn't exist, still check if user is authenticated
              if (profileError.code === 'PGRST116') {
                // No rows returned - profile doesn't exist, treat as non-admin
                setUser(null);
                setIsAdmin(false);
                setShowLoginModal(true);
              } else {
                // Other database error
                setUser(session.user);
                setIsAdmin(false);
                setShowLoginModal(true);
              }
            } else if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
              console.log('User does not have admin role:', profile?.role);
              setUser(null);
              setIsAdmin(false);
              setShowLoginModal(true);
            } else {
              console.log('User authenticated with admin role:', profile.role);
              setUser(session.user);
              setIsAdmin(true);
              setShowLoginModal(false);
            }
          }
        } else {
          console.log('No active session found');
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
            setShowLoginModal(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setShowLoginModal(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener with improved error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setIsAdmin(false);
          setShowLoginModal(true);
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          
          // Check admin role for newly signed in user
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile check error on sign in:', profileError);
            setUser(null);
            setIsAdmin(false);
            setShowLoginModal(true);
          } else if (profile && ['admin', 'super_admin'].includes(profile.role)) {
            setUser(session.user);
            setIsAdmin(true);
            setShowLoginModal(false);
          } else {
            setUser(null);
            setIsAdmin(false);
            setShowLoginModal(true);
          }
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Handle token refresh - maintain current state if already authenticated
          if (isAdmin) {
            setUser(session.user);
          }
        }
      }
    );

    // Check for existing session on component mount
    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isAdmin]); // Include isAdmin in dependency array for token refresh handling

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Authentication state will be updated by onAuthStateChange
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-300 mb-6">Please log in with your admin credentials to continue.</p>
          <AdminLogin showTrigger={false} onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
