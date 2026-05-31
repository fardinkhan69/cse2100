import { useState } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Mail, Phone, UserCog, Stethoscope, HeartPulse, ClipboardList, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockStaff } from '@/services/mockData';

const roleStyles: Record<string, { badge: string; gradient: string }> = {
  doctor: { badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', gradient: 'gradient-brand' },
  nurse: { badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', gradient: 'gradient-emerald' },
  receptionist: { badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', gradient: 'gradient-violet' },
  admin: { badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', gradient: 'gradient-rose' },
};

const StaffPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: '', specialization: '' });

  const filteredStaff = mockStaff.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = [
    { label: 'Doctors', value: mockStaff.filter((s) => s.role === 'doctor').length, icon: Stethoscope, gradient: 'gradient-brand' },
    { label: 'Nurses', value: mockStaff.filter((s) => s.role === 'nurse').length, icon: HeartPulse, gradient: 'gradient-emerald' },
    { label: 'Reception', value: mockStaff.filter((s) => s.role === 'receptionist').length, icon: ClipboardList, gradient: 'gradient-violet' },
    { label: 'Admins', value: mockStaff.filter((s) => s.role === 'admin').length, icon: ShieldCheck, gradient: 'gradient-rose' },
  ];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Staff Added', description: newStaff.name + ' has been added to the team.' });
    setDialogOpen(false);
    setNewStaff({ name: '', email: '', phone: '', role: '', specialization: '' });
  };

  return (
    <DashboardLayout title="Staff">
      <PageHeader
        title="Staff & Roles"
        description="Manage your clinic team and their roles."
        icon={<UserCog className="h-5 w-5" />}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Add Staff</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Staff Member</DialogTitle></DialogHeader>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="space-y-1.5"><Label>Name</Label><Input value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} required /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} required /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} required /></div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={newStaff.role} onValueChange={(v) => setNewStaff({ ...newStaff, role: v })}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newStaff.role === 'doctor' && (
                  <div className="space-y-1.5"><Label>Specialization</Label><Input value={newStaff.specialization} onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })} /></div>
                )}
                <Button type="submit" className="w-full">Add Staff Member</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Role counts */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {roleCounts.map((r, i) => (
          <motion.div key={r.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-2xl card-elevated p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md ${r.gradient}`}><r.icon className="h-5 w-5" /></div>
            <div><p className="text-xs text-muted-foreground">{r.label}</p><p className="text-xl font-bold text-foreground">{r.value}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="doctor">Doctors</SelectItem>
            <SelectItem value="nurse">Nurses</SelectItem>
            <SelectItem value="receptionist">Receptionists</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff, i) => {
          const style = roleStyles[staff.role];
          return (
            <motion.div key={staff.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="card-elevated border-border/60 hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${style.gradient}`}>
                      <span className="text-base font-bold">{staff.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate text-sm font-semibold text-foreground">{staff.name}</h3>
                        <span className={`h-2.5 w-2.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} title={staff.status} />
                      </div>
                      <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium capitalize ${style.badge}`}>{staff.role}</span>
                      {staff.specialization && <p className="mt-1 text-xs text-muted-foreground">{staff.specialization}</p>}
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" /><span className="truncate">{staff.email}</span></div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3.5 w-3.5" /><span>{staff.phone}</span></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      {filteredStaff.length === 0 && <EmptyState icon={UserCog} title="No staff found" description="Try a different search or filter." />}
    </DashboardLayout>
  );
};

export default StaffPage;
