import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const CreateAdminUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
          throw promoteError;
        }

        toast({
          title: "Admin User Created",
          description: `Admin account created successfully for ${email}`,
        });
        
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-cyan-400" />
          Create New Admin User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
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
              className="bg-slate-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 pr-10"
              required
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Admin...
              </div>
            ) : (
              'Create Admin User'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUser;