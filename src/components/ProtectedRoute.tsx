import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "./AdminLogin";

const ProtectedRoute = ({ children }) => {
  console.log(children);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (!session?.user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      // Check admin role if needed
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (profile && ["admin", "super_admin"].includes(profile.role)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Show loading spinner while authenticating
  if (isLoading) return <div>Verifying authentication...</div>;

  // If not authenticated, redirect to login or show your modal
  if (!isAuthenticated) return <AdminLogin/> // or return <AdminLogin />

  // If authenticated, show protected children/routes
  return <>{children}</>;
};

export default ProtectedRoute;
