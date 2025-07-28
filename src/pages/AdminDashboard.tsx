
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { databaseAPI } from '@/utils/database';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddPropertyForm from '@/components/AddPropertyForm';
import HeroSliderManager from '@/components/HeroSliderManager';
import AdminLogin from '@/components/AdminLogin';
import CreateAdminUser from '@/components/CreateAdminUser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Home, Building, Users, Database, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalProperties: number;
  totalEnquiries: number;
  totalSubscribers: number;
  recentEnquiries: any[];
  newsletterSubscriptions: any[];
  propertyByType: { name: string; value: number }[];
  propertyByLocation: { name: string; value: number }[];
  enquiriesByMonth: { month: string; count: number }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Check if user has admin role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          if (profile && ['admin', 'super_admin'].includes(profile.role)) {
            setIsAdmin(true);
            fetchAnalyticsData();
          } else {
            setIsAdmin(false);
            toast({
              title: "Access Denied",
              description: "Admin privileges required",
              variant: "destructive",
            });
            navigate('/');
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          toast({
            title: "Access Denied",
            description: "Please log in to access the admin dashboard",
            variant: "destructive",
          });
          navigate('/');
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        
        // Check admin role for current user
        supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile && ['admin', 'super_admin'].includes(profile.role)) {
              setIsAdmin(true);
              fetchAnalyticsData();
            } else {
              setIsAdmin(false);
              toast({
                title: "Access Denied",
                description: "Admin privileges required",
                variant: "destructive",
              });
              navigate('/');
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('Fetching analytics data...');
      
      // Fetch data from Supabase
      const [properties, enquiries, subscriptions] = await Promise.all([
        databaseAPI.fetchAllProperties(),
        databaseAPI.fetchEnquiries(),
        databaseAPI.fetchNewsletterSubscriptions()
      ]);

      console.log('Properties fetched:', properties.length);
      console.log('Enquiries fetched:', enquiries.length);

      // Process property data by type
      const propertyByType = properties.reduce((acc: any, property: any) => {
        const type = property.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Process property data by location
      const propertyByLocation = properties.reduce((acc: any, property: any) => {
        const location = property.location || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

      // Process enquiries by month
      const enquiriesByMonth = enquiries.reduce((acc: any, enquiry: any) => {
        const date = new Date(enquiry.created_at);
        const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const analyticsData: AnalyticsData = {
        totalProperties: properties.length,
        totalEnquiries: enquiries.length,
        totalSubscribers: subscriptions.length,
        recentEnquiries: enquiries.slice(0, 10),
        newsletterSubscriptions: subscriptions.slice(0, 20),
        propertyByType: Object.entries(propertyByType).map(([name, value]) => ({ name, value: value as number })),
        propertyByLocation: Object.entries(propertyByLocation).map(([name, value]) => ({ name, value: value as number })),
        enquiriesByMonth: Object.entries(enquiriesByMonth).map(([month, count]) => ({ month, count: count as number }))
      };

      setAnalyticsData(analyticsData);
      console.log('Analytics data processed successfully');
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handlePropertyAdded = () => {
    fetchAnalyticsData(); // Refresh data after adding property
    setActiveTab('overview'); // Switch back to overview
    toast({
      title: "Success",
      description: "Property added successfully",
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Show login form if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Access Required</h1>
          <AdminLogin showTrigger={true} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-white text-xl ml-4">Loading analytics...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">TrueView Reality Analytics & Management</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview" className="text-white">
              <Building className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="text-white">
              <Users className="w-4 h-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="hero-management" className="text-white">
              <Home className="w-4 h-4 mr-2" />
              Hero Slider
            </TabsTrigger>
            <TabsTrigger value="add-property" className="text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </TabsTrigger>
            <TabsTrigger value="create-admin" className="text-white">
              <Users className="w-4 h-4 mr-2" />
              Create Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Properties</CardTitle>
                  <Building className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData?.totalProperties || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Enquiries</CardTitle>
                  <Users className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData?.totalEnquiries || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Newsletter Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData?.totalSubscribers || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Database Status</CardTitle>
                  <Database className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">Active</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Types Chart */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Properties by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData?.propertyByType || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData?.propertyByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enquiries by Month */}
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Enquiries by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData?.enquiriesByMonth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Enquiries Table */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Enquiries</CardTitle>
                <CardDescription className="text-gray-300">Latest customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Phone</TableHead>
                      <TableHead className="text-gray-300">Property</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData?.recentEnquiries.map((enquiry, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-white">{enquiry.name}</TableCell>
                        <TableCell className="text-gray-300">{enquiry.email}</TableCell>
                        <TableCell className="text-gray-300">{enquiry.phone}</TableCell>
                        <TableCell className="text-gray-300">
                          {enquiry.property_details?.property || 'General'}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            {/* Newsletter Subscribers Table */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Newsletter Subscribers</CardTitle>
                <CardDescription className="text-gray-300">Users subscribed to property updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Subscribed Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData?.newsletterSubscriptions.map((subscription, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-white">{subscription.email}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(subscription.subscribed_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Active
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero-management">
            <HeroSliderManager />
          </TabsContent>

          <TabsContent value="add-property">
            <AddPropertyForm 
              onSuccess={handlePropertyAdded}
              onCancel={() => setActiveTab('overview')}
            />
          </TabsContent>

          <TabsContent value="create-admin">
            <CreateAdminUser />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
