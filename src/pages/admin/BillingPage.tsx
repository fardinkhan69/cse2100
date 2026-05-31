import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Clock, CheckCircle, AlertCircle, Plus, Download, Eye } from 'lucide-react';
import { mockInvoices } from '@/services/mockData';

const BillingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const outstanding = mockInvoices.filter((i) => i.status === 'pending').reduce((sum, inv) => sum + inv.total, 0);
  const paidThisMonth = mockInvoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = mockInvoices.filter((i) => i.status === 'overdue').length;

  const stats = [
    { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: DollarSign, color: 'text-green-600 bg-green-50' },
    { label: 'Outstanding', value: '$' + outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Paid This Month', value: '$' + paidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    { label: 'Overdue', value: overdueCount.toString(), icon: AlertCircle, color: 'text-red-600 bg-red-50' },
  ];

  const filteredInvoices = activeTab === 'all'
    ? mockInvoices
    : mockInvoices.filter((i) => i.status === activeTab);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return map[status] || '';
  };

  return (
    <DashboardLayout title="Billing">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs and Table */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button className="bg-medical-medium hover:bg-medical-dark" onClick={() => navigate('/admin/billing/create')}>
              <Plus className="w-4 h-4 mr-2" /> Create Invoice
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Invoice #</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Patient</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Due Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-medium">{inv.invoiceNumber}</td>
                    <td className="p-3 text-sm">{inv.patientName}</td>
                    <td className="p-3 text-sm font-medium">${inv.total.toFixed(2)}</td>
                    <td className="p-3 text-sm text-gray-600">{inv.createdAt}</td>
                    <td className="p-3 text-sm text-gray-600">{inv.dueDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default BillingPage;
