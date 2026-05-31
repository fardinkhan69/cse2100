import { useState } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Pill, Search, Plus, Package, DollarSign, AlertTriangle, CalendarClock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockMedicines, mockPharmacyStats, type Medicine } from '@/services/mockData';

const PharmacyPage = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', genericName: '', category: '', quantity: 0, unitPrice: 0 });

  const filtered = mockMedicines.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || m.category === category;
    return matchesSearch && matchesCat;
  });

  const lowStockMeds = mockMedicines.filter((m) => m.status !== 'in-stock');

  const stats = [
    { label: 'Total Items', value: mockPharmacyStats.totalItems.toString(), icon: Package, gradient: 'gradient-brand' },
    { label: 'Inventory Value', value: '$' + mockPharmacyStats.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 0 }), icon: DollarSign, gradient: 'gradient-emerald' },
    { label: 'Low Stock', value: mockPharmacyStats.lowStockCount.toString(), icon: AlertTriangle, gradient: 'gradient-amber' },
    { label: 'Expiring Soon', value: mockPharmacyStats.expiringSoonCount.toString(), icon: CalendarClock, gradient: 'gradient-rose' },
  ];

  const stockPercent = (m: Medicine) => Math.min(100, Math.round((m.quantity / (m.minStockLevel * 3)) * 100));
  const stockBarColor = (m: Medicine) =>
    m.status === 'out-of-stock' ? 'bg-rose-500' : m.status === 'low-stock' ? 'bg-amber-500' : 'bg-emerald-500';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Medicine Added', description: `${newMed.name} added to inventory.` });
    setDialogOpen(false);
    setNewMed({ name: '', genericName: '', category: '', quantity: 0, unitPrice: 0 });
  };

  return (
    <DashboardLayout title="Pharmacy">
      <PageHeader
        title="Pharmacy & Inventory"
        description="Track medicine stock, value and expiry."
        icon={<Pill className="h-5 w-5" />}
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Add Medicine</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Medicine</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5"><Label>Name</Label><Input value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} required /></div>
                <div className="space-y-1.5"><Label>Generic Name</Label><Input value={newMed.genericName} onChange={(e) => setNewMed({ ...newMed, genericName: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={newMed.category} onValueChange={(v) => setNewMed({ ...newMed, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                      <SelectContent>
                        {['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops'].map((c) => (
                          <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Quantity</Label><Input type="number" min="0" value={newMed.quantity} onChange={(e) => setNewMed({ ...newMed, quantity: parseInt(e.target.value) || 0 })} /></div>
                </div>
                <div className="space-y-1.5"><Label>Unit Price ($)</Label><Input type="number" min="0" step="0.01" value={newMed.unitPrice} onChange={(e) => setNewMed({ ...newMed, unitPrice: parseFloat(e.target.value) || 0 })} /></div>
                <Button type="submit" className="w-full">Add to Inventory</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-2xl card-elevated p-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md ${s.gradient}`}><s.icon className="h-5 w-5" /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStockMeds.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Card className="border-amber-500/30 bg-amber-500/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Stock Alerts ({lowStockMeds.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockMeds.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5">
                    <span className="text-sm font-medium text-foreground">{m.name}</span>
                    <StatusBadge status={m.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops'].map((c) => (
              <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory table */}
      <Card className="card-elevated border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {['Medicine', 'Category', 'Stock Level', 'Expiry', 'Unit Price', 'Status'].map((h) => (
                    <th key={h} className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40">
                    <td className="p-4">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.genericName}</p>
                    </td>
                    <td className="p-4">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">{m.category}</span>
                    </td>
                    <td className="p-4 w-44">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{m.quantity}</span>
                        <span className="text-muted-foreground">min {m.minStockLevel}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className={cn('h-full rounded-full transition-all', stockBarColor(m))} style={{ width: `${stockPercent(m)}%` }} />
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{m.expiryDate}</td>
                    <td className="p-4 text-sm font-semibold text-foreground">${m.unitPrice.toFixed(2)}</td>
                    <td className="p-4"><StatusBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <EmptyState icon={Pill} title="No medicines found" description="Try a different search or category." />}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default PharmacyPage;
