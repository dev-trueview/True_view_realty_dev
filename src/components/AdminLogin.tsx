
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Settings, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  showTrigger?: boolean;
  onSuccess?: () => void;
}

const AdminLogin = ({ showTrigger = true, onSuccess }: AdminLoginProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        // Sign up new admin user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin-dashboard`
          }
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Promote user to admin using our database function
          const { error: promoteError } = await supabase.rpc('promote_user_to_admin', {
            user_email: email
          });

          if (promoteError) {
            console.error('Error promoting user to admin:', promoteError);
          }

          toast({
            title: "Account Created",
            description: "Admin account created successfully. You can now log in.",
          });
          
          setIsSignup(false);
          setEmail('');
          setPassword('');
        }
      } else {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          // Check if user has admin role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', data.user.id)
            .single();

          if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
            await supabase.auth.signOut();
            throw new Error('Access denied. Admin privileges required.');
          }

          toast({
            title: "Login Successful",
            description: "Welcome to the admin dashboard",
          });
          
          setIsOpen(false);
          setEmail('');
          setPassword('');
          
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/admin-dashboard');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: isSignup ? "Signup Failed" : "Login Failed",
        description: error.message || (isSignup ? "Failed to create account" : "Invalid email or password"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setIsSignup(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-cyan-400 p-1 transition-all duration-300 hover:scale-110"
          title="Admin Access"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-gray-700 shadow-2xl" onInteractOutside={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-cyan-400 text-center text-xl font-bold">
            {isSignup ? 'Create Admin Account' : 'Admin Access'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 transition-colors"
              required
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 transition-colors pr-10"
              required
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isSignup ? 'Creating Account...' : 'Logging in...'}
              </div>
            ) : (
              isSignup ? 'Create Account' : 'Login'
            )}
          </Button>
          
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Already have an account? Login' : 'Need an admin account? Sign up'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
