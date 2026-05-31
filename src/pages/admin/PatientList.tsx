import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, ChevronLeft, ChevronRight, Users, UserCheck, UserMinus, ChevronRight as Chevron } from 'lucide-react';
import { mockPatients } from '@/services/mockData';

const gradients = ['gradient-brand', 'gradient-violet', 'gradient-emerald', 'gradient-amber', 'gradient-rose'];

const PatientList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filteredPatients = mockPatients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredPatients.length / perPage);
  const paginatedPatients = filteredPatients.slice((page - 1) * perPage, page * perPage);

  const activeCount = mockPatients.filter((p) => p.status === 'active').length;
  const inactiveCount = mockPatients.filter((p) => p.status === 'inactive').length;

  const miniStats = [
    { label: 'Total Patients', value: mockPatients.length, icon: Users, gradient: 'gradient-brand' },
    { label: 'Active', value: activeCount, icon: UserCheck, gradient: 'gradient-emerald' },
    { label: 'Inactive', value: inactiveCount, icon: UserMinus, gradient: 'gradient-amber' },
  ];

  return (
    <DashboardLayout title="Patients">
      <PageHeader
        title="Patients"
        description="Manage patient records and medical profiles."
        icon={<Users className="h-5 w-5" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Patient
          </Button>
        }
      />

      {/* Mini stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {miniStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-2xl card-elevated p-4"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md ${s.gradient}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <Card className="hidden card-elevated border-border/60 md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Patient</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blood</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visits</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Visit</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map((patient, i) => (
                <tr
                  key={patient.id}
                  className="group cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                  onClick={() => navigate(`/admin/patients/${patient.id}`)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${gradients[i % gradients.length]}`}>
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{patient.email}</p>
                    <p className="text-xs text-muted-foreground">{patient.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">{patient.bloodGroup}</span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{patient.totalVisits}</td>
                  <td className="p-4 text-sm text-muted-foreground">{patient.lastVisit}</td>
                  <td className="p-4"><StatusBadge status={patient.status} /></td>
                  <td className="p-4">
                    <Chevron className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedPatients.length === 0 && (
            <EmptyState icon={Users} title="No patients found" description="Try adjusting your search or filter." />
          )}
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {paginatedPatients.map((patient, i) => (
          <Card
            key={patient.id}
            className="card-elevated cursor-pointer border-border/60 hover-lift"
            onClick={() => navigate(`/admin/patients/${patient.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${gradients[i % gradients.length]}`}>
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.email}</p>
                  </div>
                </div>
                <StatusBadge status={patient.status} />
              </div>
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>{patient.phone}</span>
                <span>{patient.totalVisits} visits · Last {patient.lastVisit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {paginatedPatients.length === 0 && (
          <EmptyState icon={Users} title="No patients found" description="Try adjusting your search or filter." />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" onClick={() => setPage(p)}>
              {p}
            </Button>
          ))}
          <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientList;
