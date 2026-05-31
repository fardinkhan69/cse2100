import { useState } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, List, Columns, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { getDaysInMonth, startOfMonth, getDay, format, addMonths, subMonths } from 'date-fns';
import { mockAppointments } from '@/services/mockData';

type ViewMode = 'list' | 'calendar' | 'queue';

const AppointmentsPage = () => {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1));

  const daysCount = getDaysInMonth(currentMonth);
  const startDayOfWeek = getDay(startOfMonth(currentMonth));
  const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
  const leadingEmptyCells = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const appointmentsForDate = mockAppointments.filter((a) => a.date === selectedDate);
  const waitingAppts = mockAppointments.filter((a) => a.status === 'scheduled');
  const inProgressAppts = mockAppointments.filter((a) => a.status === 'in-progress');
  const completedAppts = mockAppointments.filter((a) => a.status === 'completed');

  const viewButtons: { mode: ViewMode; label: string; icon: typeof List }[] = [
    { mode: 'calendar', label: 'Calendar', icon: Calendar },
    { mode: 'list', label: 'List', icon: List },
    { mode: 'queue', label: 'Queue', icon: Columns },
  ];

  const queueColumns = [
    { title: 'Waiting', items: waitingAppts, accent: 'border-t-blue-500', badge: 'scheduled' },
    { title: 'In Progress', items: inProgressAppts, accent: 'border-t-amber-500', badge: 'in-progress' },
    { title: 'Completed', items: completedAppts, accent: 'border-t-emerald-500', badge: 'completed' },
  ];

  return (
    <DashboardLayout title="Appointments">
      <PageHeader
        title="Appointments"
        description="Schedule, track and manage patient appointments."
        icon={<Calendar className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
              {viewButtons.map((vb) => (
                <button
                  key={vb.mode}
                  onClick={() => setView(vb.mode)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                    view === vb.mode ? 'gradient-brand text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <vb.icon className="h-4 w-4" /> <span className="hidden sm:inline">{vb.label}</span>
                </button>
              ))}
            </div>
            <Button className="gap-2"><Plus className="h-4 w-4" /> <span className="hidden sm:inline">New</span></Button>
          </div>
        }
      />

      {/* List view */}
      {view === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="card-elevated border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {['Patient', 'Doctor', 'Date', 'Time', 'Type', 'Status'].map((h) => (
                        <th key={h} className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40">
                        <td className="p-4 text-sm font-semibold text-foreground">{apt.patientName}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.doctorName}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.date}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.time}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.type}</td>
                        <td className="p-4"><StatusBadge status={apt.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Calendar view */}
      {view === 'calendar' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="card-elevated border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="p-1 text-center text-xs font-semibold text-muted-foreground">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {leadingEmptyCells.map((i) => <div key={`empty-${i}`} />)}
                  {daysInMonth.map((day) => {
                    const dateStr = `${format(currentMonth, 'yyyy-MM')}-${String(day).padStart(2, '0')}`;
                    const count = mockAppointments.filter((a) => a.date === dateStr).length;
                    const isSelected = dateStr === selectedDate;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          'relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-all',
                          isSelected ? 'gradient-brand text-white shadow-md' : 'hover:bg-muted text-foreground'
                        )}
                      >
                        {day}
                        {count > 0 && (
                          <span className={cn(
                            'mt-0.5 rounded-full px-1.5 text-[9px] font-bold',
                            isSelected ? 'bg-white/25 text-white' : 'bg-primary/10 text-primary'
                          )}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="card-elevated h-full border-border/60">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {appointmentsForDate.length > 0 ? (
                    appointmentsForDate.map((apt) => (
                      <div key={apt.id} className="rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{apt.patientName}</span>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{apt.time} · {apt.doctorName}</p>
                      </div>
                    ))
                  ) : (
                    <EmptyState icon={Calendar} title="No appointments" description="Nothing scheduled for this date." />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Queue view */}
      {view === 'queue' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {queueColumns.map((col) => (
            <Card key={col.title} className={cn('card-elevated border-t-4 border-border/60', col.accent)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{col.title}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{col.items.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {col.items.slice(0, 8).map((apt) => (
                  <div key={apt.id} className="cursor-grab rounded-xl border border-border/60 bg-card p-3 transition-all hover:shadow-md active:cursor-grabbing">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{apt.patientName}</p>
                      <span className="text-xs font-medium text-muted-foreground">{apt.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{apt.doctorName}</p>
                    <span className="mt-2 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{apt.type}</span>
                  </div>
                ))}
                {col.items.length === 0 && (
                  <p className="py-6 text-center text-xs text-muted-foreground">Empty</p>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default AppointmentsPage;
