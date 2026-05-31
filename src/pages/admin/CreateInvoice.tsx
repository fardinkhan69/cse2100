import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, FileText, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockPatients, mockClinicSettings } from '@/services/mockData';

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patientId, setPatientId] = useState('');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<LineItem[]>([{ id: '1', name: '', quantity: 1, unitPrice: 0 }]);

  const addItem = () => setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => { if (items.length > 1) setItems(items.filter((i) => i.id !== id)); };
  const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const addServiceFromCatalog = (svcId: string) => {
    const svc = mockClinicSettings.services.find((s) => s.id === svcId);
    if (!svc) return;
    const empty = items.find((i) => !i.name.trim());
    if (empty) {
      updateItem(empty.id, 'name', svc.name);
      updateItem(empty.id, 'unitPrice', svc.price);
    } else {
      setItems([...items, { id: Date.now().toString(), name: svc.name, quantity: 1, unitPrice: svc.price }]);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax - discount;
  const selectedPatient = mockPatients.find((p) => p.id === patientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast({ title: 'Validation Error', description: 'Please select a patient.', variant: 'destructive' });
      return;
    }
    if (items.some((item) => !item.name.trim() || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast({ title: 'Validation Error', description: 'Each line item must have a name, positive quantity, and positive price.', variant: 'destructive' });
      return;
    }
    if (discount < 0) {
      toast({ title: 'Validation Error', description: 'Discount cannot be negative.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Invoice Created', description: 'Invoice has been created successfully.' });
    navigate('/admin/billing');
  };

  return (
    <DashboardLayout title="Create Invoice">
      <PageHeader title="Create Invoice" description="Generate a new invoice for a patient." icon={<FileText className="h-5 w-5" />} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form column */}
          <div className="space-y-4 lg:col-span-2">
            <Card className="card-elevated border-border/60">
              <CardHeader><CardTitle className="text-base">Patient & Services</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Patient</Label>
                    <Select value={patientId} onValueChange={setPatientId}>
                      <SelectTrigger><SelectValue placeholder="Choose a patient..." /></SelectTrigger>
                      <SelectContent>
                        {mockPatients.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Quick add service</Label>
                    <Select value="" onValueChange={addServiceFromCatalog}>
                      <SelectTrigger><SelectValue placeholder="Add from catalog..." /></SelectTrigger>
                      <SelectContent>
                        {mockClinicSettings.services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name} — ${s.price}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="hidden grid-cols-12 gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                    <div className="col-span-5">Service</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-1" />
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-12">
                      <div className="sm:col-span-5">
                        <Input placeholder="Service name" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="sm:col-span-2">
                        <Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div className="text-sm font-semibold text-foreground sm:col-span-2">${(item.quantity * item.unitPrice).toFixed(2)}</div>
                      <div className="sm:col-span-1">
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addItem}>
                    <Plus className="h-4 w-4" /> Add Row
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated border-border/60">
              <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
              <CardContent>
                <textarea
                  className="min-h-[90px] w-full resize-y rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview column */}
          <div className="lg:col-span-1">
            <Card className="card-elevated sticky top-4 border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-4 w-4 text-primary" /> Invoice Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Billed To</p>
                  <p className="font-semibold text-foreground">{selectedPatient?.name || '—'}</p>
                  {selectedPatient && <p className="text-xs text-muted-foreground">{selectedPatient.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (5%)</span><span className="text-foreground">${tax.toFixed(2)}</span></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <Input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="h-8 w-24 text-right" />
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold"><span className="text-foreground">Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Button type="submit" className="w-full">Create Invoice</Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/admin/billing')}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateInvoice;
