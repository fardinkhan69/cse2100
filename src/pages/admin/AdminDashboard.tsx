import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Users, Calendar, DollarSign, UserCheck, Plus, FileText, TrendingUp,
  LayoutDashboard, ArrowRight, Star, Clock, Activity,
} from 'lucide-react';
import {
  mockDashboardStats, revenueTrendData, appointmentStatusData, mockActivityFeed,
  patientsSparkline, appointmentsSparkline, revenueSparkline, doctorsSparkline,
  todaySchedule, doctorPerformanceData,
} from '@/services/mockData';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'New Appointment', icon: Calendar, action: () => navigate('/admin/appointments'), gradient: 'gradient-brand' },
    { label: 'Add Patient', icon: Plus, action: () => navigate('/admin/patients'), gradient: 'gradient-emerald' },
    { label: 'Create Invoice', icon: FileText, action: () => navigate('/admin/billing/create'), gradient: 'gradient-violet' },
    { label: 'View Reports', icon: TrendingUp, action: () => navigate('/admin/analytics'), gradient: 'gradient-amber' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <PageHeader
        title="Welcome back 👋"
        description="Here's what's happening at your clinic today."
        icon={<LayoutDashboard className="h-5 w-5" />}
        actions={
          <Button onClick={() => navigate('/admin/billing/create')} className="gap-2">
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Patients" value={mockDashboardStats.totalPatients.value.toLocaleString()} change={mockDashboardStats.totalPatients.percentChange} icon={Users} gradient="gradient-brand" sparkline={patientsSparkline} delay={0} />
        <StatCard label="Appointments Today" value={mockDashboardStats.appointmentsToday.value.toString()} change={mockDashboardStats.appointmentsToday.percentChange} icon={Calendar} gradient="gradient-emerald" sparkline={appointmentsSparkline} delay={0.05} />
        <StatCard label="Monthly Revenue" value={'$' + mockDashboardStats.monthlyRevenue.value.toLocaleString()} change={mockDashboardStats.monthlyRevenue.percentChange} icon={DollarSign} gradient="gradient-violet" sparkline={revenueSparkline} delay={0.1} />
        <StatCard label="Active Doctors" value={mockDashboardStats.activeDoctors.value.toString()} change={mockDashboardStats.activeDoctors.percentChange} icon={UserCheck} gradient="gradient-amber" sparkline={doctorsSparkline} delay={0.15} />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <p className="text-xs text-muted-foreground">Monthly revenue vs target</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3 w-3" /> +15.3%
              </span>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" strokeWidth={1.5} fill="none" />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Appointment Status</CardTitle>
              <p className="text-xs text-muted-foreground">This month breakdown</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={appointmentStatusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {appointmentStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            className="group flex items-center gap-3 rounded-2xl card-elevated p-4 text-left transition-all hover:-translate-y-0.5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md ${action.gradient}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground">{action.label}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </motion.div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Today's schedule */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Today's Schedule</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/admin/appointments')}>
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaySchedule.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/50">
                    <div className="flex w-14 flex-col items-center justify-center rounded-lg bg-primary/10 py-1.5 text-primary">
                      <span className="text-sm font-bold leading-none">{item.time}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{item.patient}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.type} · {item.doctor}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {mockActivityFeed.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="relative flex gap-3">
                    <div className="z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-4 ring-card">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-sm leading-snug text-foreground">{activity.message}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top doctors */}
      <motion.div className="mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card className="card-elevated border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Top Performing Doctors</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/admin/analytics')}>
              Analytics <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {doctorPerformanceData.slice(0, 3).map((doc, i) => (
                <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-white font-semibold ${['gradient-brand', 'gradient-violet', 'gradient-emerald'][i]}`}>
                    {doc.name.split(' ')[1]?.charAt(0) || doc.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{doc.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{doc.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-0.5 text-sm font-bold text-foreground"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {doc.rating}</p>
                    <p className="text-xs text-muted-foreground">{doc.appointments} appts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
