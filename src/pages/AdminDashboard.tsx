import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { databaseAPI } from '@/utils/database';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddPropertyForm from '@/components/AddPropertyForm';
import HeroSliderManager from '@/components/HeroSliderManager';
import PropertyManagement from '@/components/PropertyManagement';
import CreateAdminUser from '@/components/CreateAdminUser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Home, Building, Users, Database, Plus, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user and fetch data immediately since we're protected by ProtectedRoute
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchAnalyticsData();
      }
    };

    getCurrentUser();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('Fetching analytics data...');
      
      // Optimized parallel data fetching
      const [properties, enquiries, subscriptions] = await Promise.all([
        databaseAPI.fetchAllProperties(),
        databaseAPI.fetchEnquiries(),
        databaseAPI.fetchNewsletterSubscriptions()
      ]);

      console.log('Properties fetched:', properties.length);
      console.log('Enquiries fetched:', enquiries.length);
      console.log('Subscriptions fetched:', subscriptions.length);

      // Process data for charts
      const propertyByType = properties.reduce((acc: any, property: any) => {
        const type = property.type || 'Unknown';
        const existing = acc.find((item: any) => item.name === type);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: type, value: 1 });
        }
        return acc;
      }, []);

      const propertyByLocation = properties.reduce((acc: any, property: any) => {
        const location = property.location || 'Unknown';
        const existing = acc.find((item: any) => item.name === location);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: location, value: 1 });
        }
        return acc;
      }, []);

      // Process enquiries by month
      const enquiriesByMonth = enquiries.reduce((acc: any, enquiry: any) => {
        const date = new Date(enquiry.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const existing = acc.find((item: any) => item.month === monthKey);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ month: monthKey, count: 1 });
        }
        return acc;
      }, []).sort((a: any, b: any) => a.month.localeCompare(b.month));

      setAnalyticsData({
        totalProperties: properties.length,
        totalEnquiries: enquiries.length,
        totalSubscribers: subscriptions.length,
        recentEnquiries: enquiries.slice(-10),
        newsletterSubscriptions: subscriptions,
        propertyByType,
        propertyByLocation,
        enquiriesByMonth
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Data Loading Error",
        description: "Some analytics data may not be available. Please refresh the page.",
        variant: "destructive",
      });
      
      // Set minimal data to prevent crashes
      setAnalyticsData({
        totalProperties: 0,
        totalEnquiries: 0,
        totalSubscribers: 0,
        recentEnquiries: [],
        newsletterSubscriptions: [],
        propertyByType: [],
        propertyByLocation: [],
        enquiriesByMonth: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePropertyAdded = () => {
    fetchAnalyticsData(); // Refresh data after adding property
    setActiveTab('overview'); // Switch back to overview
    toast({
      title: "Success",
      description: "Property added successfully and analytics refreshed",
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm sm:text-base">TrueView Reality Analytics & Management</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white shrink-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Responsive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile: Horizontal scrollable tabs */}
          {isMobile ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex bg-slate-800/50 p-1 h-auto">
                <TabsTrigger value="overview" className="text-white text-xs px-3 py-2 whitespace-nowrap">
                  <Building className="w-3 h-3 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="properties" className="text-white text-xs px-3 py-2 whitespace-nowrap">
                  <Building className="w-3 h-3 mr-1" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value="subscribers" className="text-white text-xs px-3 py-2 whitespace-nowrap">
                  <Users className="w-3 h-3 mr-1" />
                  Subscribers
                </TabsTrigger>
                <TabsTrigger value="hero-management" className="text-white text-xs px-3 py-2 whitespace-nowrap">
                  <Home className="w-3 h-3 mr-1" />
                  Hero
                </TabsTrigger>
                <TabsTrigger value="add-property" className="text-white text-xs px-3 py-2 whitespace-nowrap">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Property
                </TabsTrigger>
                <TabsTrigger value="create-admin" className="text-white text-xs px-3 py-2 whitespace-nowrap">
                  <Users className="w-3 h-3 mr-1" />
                  Create Admin
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            /* Desktop: Grid layout */
            <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
              <TabsTrigger value="overview" className="text-white">
                <Building className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-white">
                <Building className="w-4 h-4 mr-2" />
                Properties
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
          )}

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

            {/* Charts - Responsive Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                        outerRadius={isMobile ? 60 : 80}
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
                      <XAxis 
                        dataKey="month" 
                        fontSize={isMobile ? 10 : 12}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis fontSize={isMobile ? 10 : 12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Enquiries Table - Responsive */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Enquiries</CardTitle>
                <CardDescription className="text-gray-300">Latest customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  // Mobile: Card layout for better readability
                  <div className="space-y-4">
                    {analyticsData?.recentEnquiries.slice(0, 5).map((enquiry, index) => (
                      <div key={index} className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-white">{enquiry.name}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(enquiry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">{enquiry.email}</div>
                        <div className="text-sm text-gray-300">{enquiry.phone}</div>
                        <div className="text-xs text-gray-400">
                          Property: {enquiry.property_details?.property || 'General'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop: Table layout
                  <div className="overflow-x-auto">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            {/* Newsletter Subscribers - Responsive */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">Newsletter Subscribers</CardTitle>
                <CardDescription className="text-gray-300">Users subscribed to property updates</CardDescription>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  // Mobile: Card layout
                  <div className="space-y-4">
                    {analyticsData?.newsletterSubscriptions.map((subscription, index) => (
                      <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="text-white font-medium">{subscription.email}</div>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Active
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          {new Date(subscription.subscribed_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop: Table layout
                  <div className="overflow-x-auto">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManagement />
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
