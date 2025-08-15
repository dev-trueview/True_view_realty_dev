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
        // Get current session
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
          // Check if user has admin role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (mounted) {
            if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
              setUser(null);
              setIsAdmin(false);
              setShowLoginModal(true);
            } else {
              setUser(session.user);
              setIsAdmin(true);
              setShowLoginModal(false);
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            setIsAdmin(false);
            setShowLoginModal(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setShowLoginModal(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setIsAdmin(false);
          setShowLoginModal(true);
          setLoading(false);
        } else if (session?.user) {
          // Check admin role for signed in user
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (profile && ['admin', 'super_admin'].includes(profile.role)) {
            setUser(session.user);
            setIsAdmin(true);
            setShowLoginModal(false);
          } else {
            setUser(null);
            setIsAdmin(false);
            setShowLoginModal(true);
          }
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // checkAuth will be triggered by onAuthStateChange
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
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