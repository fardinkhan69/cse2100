import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Thermometer, Weight, Activity, Download, Calendar } from 'lucide-react';
import { mockPatients, mockAppointments, mockInvoices } from '@/services/mockData';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = mockPatients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <DashboardLayout title="Patient Details">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">Patient not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/patients')}>
            Back to Patients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const patientAppointments = mockAppointments.filter((a) => a.patientId === patientId);
  const patientInvoices = mockInvoices.filter((inv) => inv.patientId === patientId);

  const vitals = [
    { label: 'Blood Pressure', value: '120/80 mmHg', icon: Activity, color: 'text-red-500 bg-red-50' },
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-pink-500 bg-pink-50' },
    { label: 'Temperature', value: '98.6 F', icon: Thermometer, color: 'text-orange-500 bg-orange-50' },
    { label: 'Weight', value: '165 lbs', icon: Weight, color: 'text-blue-500 bg-blue-50' },
  ];

  const medicalHistory = [
    { date: '2024-01-15', event: 'General Checkup - All normal', doctor: 'Dr. Amanda Foster' },
    { date: '2023-12-01', event: 'Flu vaccination administered', doctor: 'Dr. Sarah Mitchell' },
    { date: '2023-10-20', event: 'Blood work - cholesterol slightly elevated', doctor: 'Dr. Richard Park' },
    { date: '2023-08-15', event: 'Annual physical examination', doctor: 'Dr. Amanda Foster' },
    { date: '2023-05-10', event: 'Follow-up for minor surgery', doctor: 'Dr. James Cooper' },
  ];

  const prescriptions = [
    { id: 'rx1', medication: 'Lisinopril 10mg', dosage: 'Once daily', prescribedBy: 'Dr. Foster', date: '2024-01-15' },
    { id: 'rx2', medication: 'Atorvastatin 20mg', dosage: 'Once daily at bedtime', prescribedBy: 'Dr. Park', date: '2023-10-20' },
    { id: 'rx3', medication: 'Vitamin D3 1000IU', dosage: 'Once daily', prescribedBy: 'Dr. Foster', date: '2023-08-15' },
  ];

  return (
    <DashboardLayout title="Patient Details">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/admin/patients')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Patients
        </Button>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-medical-medium/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-medical-medium">
                  {patient.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{patient.name}</h2>
                <p className="text-sm text-gray-500">{patient.email}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span>Phone: {patient.phone}</span>
                  <span>Blood: {patient.bloodGroup}</span>
                  <span>Gender: {patient.gender}</span>
                  <span>Total Visits: {patient.totalVisits}</span>
                </div>
              </div>
              <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                {patient.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {vitals.map((vital) => (
              <Card key={vital.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${vital.color}`}>
                      <vital.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{vital.label}</p>
                      <p className="font-semibold">{vital.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                {patientAppointments.filter((a) => a.status === 'scheduled').length > 0 ? (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-medical-medium" />
                    <div>
                      <p className="font-medium">{patientAppointments.find((a) => a.status === 'scheduled')?.date}</p>
                      <p className="text-sm text-gray-500">{patientAppointments.find((a) => a.status === 'scheduled')?.time} - {patientAppointments.find((a) => a.status === 'scheduled')?.doctorName}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming appointments</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prescriptions.slice(0, 2).map((rx) => (
                    <div key={rx.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{rx.medication}</p>
                        <p className="text-xs text-gray-500">{rx.dosage}</p>
                      </div>
                      <span className="text-xs text-gray-400">{rx.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-0">
                {medicalHistory.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-medical-medium" />
                      {index < medicalHistory.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium">{item.event}</p>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>{item.date}</span>
                        <span>{item.doctor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Time</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Doctor</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b">
                      <td className="p-3 text-sm">{apt.date}</td>
                      <td className="p-3 text-sm">{apt.time}</td>
                      <td className="p-3 text-sm">{apt.doctorName}</td>
                      <td className="p-3 text-sm">{apt.type}</td>
                      <td className="p-3">
                        <Badge variant={apt.status === 'completed' ? 'default' : apt.status === 'cancelled' ? 'destructive' : 'secondary'}>
                          {apt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {patientAppointments.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-500">No appointments found</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Medication</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Dosage</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Prescribed By</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx) => (
                    <tr key={rx.id} className="border-b">
                      <td className="p-3 text-sm font-medium">{rx.medication}</td>
                      <td className="p-3 text-sm text-gray-600">{rx.dosage}</td>
                      <td className="p-3 text-sm text-gray-600">{rx.prescribedBy}</td>
                      <td className="p-3 text-sm text-gray-600">{rx.date}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Invoice #</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patientInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b">
                      <td className="p-3 text-sm font-medium">{inv.invoiceNumber}</td>
                      <td className="p-3 text-sm text-gray-600">{inv.createdAt}</td>
                      <td className="p-3 text-sm font-medium">${inv.total.toFixed(2)}</td>
                      <td className="p-3">
                        <Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'overdue' ? 'destructive' : 'secondary'}>
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {patientInvoices.length === 0 && (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-500">No invoices found</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PatientDetail;
