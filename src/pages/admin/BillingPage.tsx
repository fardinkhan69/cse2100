import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Clock, CheckCircle, AlertCircle, Plus, Download, Eye, Receipt } from 'lucide-react';
import { mockInvoices, revenueSparkline } from '@/services/mockData';

const BillingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const outstanding = mockInvoices.filter((i) => i.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const paidThisMonth = mockInvoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = mockInvoices.filter((i) => i.status === 'overdue').length;

  const filteredInvoices = activeTab === 'all' ? mockInvoices : mockInvoices.filter((i) => i.status === activeTab);

  const money = (n: number) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <DashboardLayout title="Billing">
      <PageHeader
        title="Billing & Invoices"
        description="Track revenue, payments and outstanding balances."
        icon={<Receipt className="h-5 w-5" />}
        actions={<Button className="gap-2" onClick={() => navigate('/admin/billing/create')}><Plus className="h-4 w-4" /> Create Invoice</Button>}
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={money(totalRevenue)} change={15.3} icon={DollarSign} gradient="gradient-emerald" sparkline={revenueSparkline} delay={0} />
        <StatCard label="Outstanding" value={money(outstanding)} change={-4.1} icon={Clock} gradient="gradient-amber" delay={0.05} />
        <StatCard label="Paid This Month" value={money(paidThisMonth)} change={8.7} icon={CheckCircle} gradient="gradient-brand" delay={0.1} />
        <StatCard label="Overdue Invoices" value={overdueCount.toString()} icon={AlertCircle} gradient="gradient-rose" delay={0.15} />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="card-elevated border-border/60">
          <CardContent className="p-4">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-muted/60">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {['Invoice #', 'Patient', 'Amount', 'Date', 'Due Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40">
                      <td className="p-4 text-sm font-semibold text-primary">{inv.invoiceNumber}</td>
                      <td className="p-4 text-sm text-foreground">{inv.patientName}</td>
                      <td className="p-4 text-sm font-semibold text-foreground">${inv.total.toFixed(2)}</td>
                      <td className="p-4 text-sm text-muted-foreground">{inv.createdAt}</td>
                      <td className="p-4 text-sm text-muted-foreground">{inv.dueDate}</td>
                      <td className="p-4"><StatusBadge status={inv.status} /></td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default BillingPage;
