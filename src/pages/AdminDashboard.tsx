
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '@/utils/adminAuth';
import { databaseAPI } from '@/utils/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Home, Building, Users, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalProperties: number;
  totalEnquiries: number;
  recentEnquiries: any[];
  propertyByType: { name: string; value: number }[];
  propertyByLocation: { name: string; value: number }[];
  enquiriesByMonth: { month: string; count: number }[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!adminAuth.isAuthenticated()) {
      navigate('/');
      return;
    }

    // Fetch analytics data
    fetchAnalyticsData();
  }, [navigate]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch data from multiple API endpoints
      const [properties, enquiries] = await Promise.all([
        databaseAPI.fetchActiveProperties(),
        fetch('http://localhost:3001/api/enquiries').then(res => res.json()).catch(() => [])
      ]);

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

      setAnalyticsData({
        totalProperties: properties.length,
        totalEnquiries: enquiries.length,
        recentEnquiries: enquiries.slice(0, 10),
        propertyByType: Object.entries(propertyByType).map(([name, value]) => ({ name, value: value as number })),
        propertyByLocation: Object.entries(propertyByLocation).map(([name, value]) => ({ name, value: value as number })),
        enquiriesByMonth: Object.entries(enquiriesByMonth).map(([month, count]) => ({ month, count: count as number }))
      });
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

  const handleLogout = () => {
    adminAuth.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading analytics...</div>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-gray-300">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData?.totalProperties || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Database Status</CardTitle>
              <Database className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Online</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                    <TableCell className="text-gray-300">{enquiry.property || 'General'}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
