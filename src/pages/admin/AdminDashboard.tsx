import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Calendar, DollarSign, UserCheck, Plus, FileText, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { mockDashboardStats, weeklyChartData, monthlyRevenueData, mockActivityFeed } from '@/services/mockData';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const statCards = [
    { label: 'Total Patients', value: mockDashboardStats.totalPatients.value.toLocaleString(), change: mockDashboardStats.totalPatients.percentChange, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Appointments Today', value: mockDashboardStats.appointmentsToday.value.toString(), change: mockDashboardStats.appointmentsToday.percentChange, icon: Calendar, color: 'text-green-600 bg-green-50' },
    { label: 'Monthly Revenue', value: '$' + mockDashboardStats.monthlyRevenue.value.toLocaleString(), change: mockDashboardStats.monthlyRevenue.percentChange, icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
    { label: 'Active Doctors', value: mockDashboardStats.activeDoctors.value.toString(), change: mockDashboardStats.activeDoctors.percentChange, icon: UserCheck, color: 'text-orange-600 bg-orange-50' },
  ];

  const quickActions = [
    { label: 'New Appointment', icon: Calendar, action: () => navigate('/admin/appointments') },
    { label: 'Add Patient', icon: Plus, action: () => navigate('/admin/patients') },
    { label: 'Create Invoice', icon: FileText, action: () => navigate('/admin/billing/create') },
    { label: 'View Reports', icon: TrendingUp, action: () => navigate('/admin/billing') },
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appointments This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="appointments" stroke="#4f9a8b" strokeWidth={2} dot={{ fill: '#4f9a8b' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4f9a8b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mockActivityFeed.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full bg-medical-medium/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-medical-medium">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={action.action}
                  >
                    <action.icon className="w-5 h-5 text-medical-medium" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
