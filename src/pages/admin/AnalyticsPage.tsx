import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { BarChart3, Users, DollarSign, CalendarCheck, Activity, Download, Star } from 'lucide-react';
import {
  revenueTrendData, revenueByCategoryData, genderSplitData, paymentMethodData,
  demographicsData, doctorPerformanceData, heatmapData, heatmapDays, heatmapHours,
  patientsSparkline, revenueSparkline, appointmentsSparkline,
} from '@/services/mockData';

const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 };

const heatColor = (v: number) => {
  const opacities = ['opacity-10', 'opacity-25', 'opacity-40', 'opacity-60', 'opacity-80', 'opacity-100'];
  return opacities[v] || opacities[0];
};

const AnalyticsPage = () => {
  return (
    <DashboardLayout title="Analytics">
      <PageHeader
        title="Analytics & Reports"
        description="Insights into revenue, patients and operations."
        icon={<BarChart3 className="h-5 w-5" />}
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>}
      />

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue (YTD)" value="$249,850" change={18.2} icon={DollarSign} gradient="gradient-emerald" sparkline={revenueSparkline} delay={0} />
        <StatCard label="New Patients" value="312" change={9.4} icon={Users} gradient="gradient-brand" sparkline={patientsSparkline} delay={0.05} />
        <StatCard label="Appointments" value="1,842" change={6.1} icon={CalendarCheck} gradient="gradient-violet" sparkline={appointmentsSparkline} delay={0.1} />
        <StatCard label="Avg. Wait Time" value="12" suffix="min" change={-3.5} icon={Activity} gradient="gradient-amber" delay={0.15} />
      </div>

      {/* Revenue + category */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#rev2)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader><CardTitle className="text-base">Revenue by Service</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByCategoryData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Donuts + demographics */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader><CardTitle className="text-base">Gender Split</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genderSplitData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {genderSplitData.map((e) => <Cell key={e.name} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader><CardTitle className="text-base">Payment Methods</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={paymentMethodData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {paymentMethodData.map((e) => <Cell key={e.name} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader><CardTitle className="text-base">Patients by Age Group</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demographicsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="group" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="male" stackId="a" fill="#60a5fa" radius={[0, 0, 0, 0]} barSize={28} />
                  <Bar dataKey="female" stackId="a" fill="#f472b6" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Doctor performance + heatmap */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Doctor Performance</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {['Doctor', 'Appts', 'Revenue', 'Rating'].map((h) => (
                        <th key={h} className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {doctorPerformanceData.map((doc) => (
                      <tr key={doc.id} className="border-b border-border/60 last:border-0">
                        <td className="p-3">
                          <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{doc.appointments}</td>
                        <td className="p-3 text-sm font-semibold text-foreground">${doc.revenue.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {doc.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="card-elevated h-full border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Appointment Activity</CardTitle>
              <p className="text-xs text-muted-foreground">Busiest hours of the week</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[420px]">
                  <div className="mb-1 grid grid-cols-[40px_repeat(10,1fr)] gap-1">
                    <div />
                    {heatmapHours.map((h) => (
                      <div key={h} className="text-center text-[9px] text-muted-foreground">{h}</div>
                    ))}
                  </div>
                  {heatmapData.map((row, ri) => (
                    <div key={ri} className="mb-1 grid grid-cols-[40px_repeat(10,1fr)] gap-1">
                      <div className="flex items-center text-[10px] font-medium text-muted-foreground">{heatmapDays[ri]}</div>
                      {row.map((v, ci) => (
                        <div
                          key={ci}
                          className={cn('aspect-square rounded-[4px] bg-primary transition-transform hover:scale-110', heatColor(v))}
                          title={`${heatmapDays[ri]} ${heatmapHours[ci]}: ${v}`}
                        />
                      ))}
                    </div>
                  ))}
                  <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                      <span key={v} className={cn('h-3 w-3 rounded-[3px] bg-primary', heatColor(v))} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
