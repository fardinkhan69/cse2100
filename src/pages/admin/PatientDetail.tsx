import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import EmptyState from '@/components/admin/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';
import {
  ArrowLeft, Heart, Thermometer, Weight, Activity, Download, Calendar,
  Mail, Phone, Droplet, MapPin, Pill, FileText, Stethoscope,
} from 'lucide-react';
import { mockPatients, mockAppointments, mockInvoices } from '@/services/mockData';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = mockPatients.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <DashboardLayout title="Patient Details">
        <EmptyState
          icon={Stethoscope}
          title="Patient not found"
          description="The patient you're looking for doesn't exist."
          action={<Button variant="outline" onClick={() => navigate('/admin/patients')}>Back to Patients</Button>}
        />
      </DashboardLayout>
    );
  }

  const patientAppointments = mockAppointments.filter((a) => a.patientId === patientId);
  const patientInvoices = mockInvoices.filter((inv) => inv.patientId === patientId);

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashCode(patient.id);
  const systolic = 110 + (seed % 30);
  const diastolic = 65 + ((seed >> 4) % 20);
  const heartRate = 60 + ((seed >> 8) % 30);
  const temp = (97.0 + ((seed >> 12) % 20) / 10).toFixed(1);
  const weight = 130 + ((seed >> 16) % 70);

  const vitals = [
    { label: 'Blood Pressure', value: `${systolic}/${diastolic}`, unit: 'mmHg', icon: Activity, gradient: 'gradient-rose' },
    { label: 'Heart Rate', value: `${heartRate}`, unit: 'bpm', icon: Heart, gradient: 'gradient-violet' },
    { label: 'Temperature', value: `${temp}`, unit: '°F', icon: Thermometer, gradient: 'gradient-amber' },
    { label: 'Weight', value: `${weight}`, unit: 'lbs', icon: Weight, gradient: 'gradient-brand' },
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

  const nextAppt = patientAppointments.find((a) => a.status === 'scheduled');

  return (
    <DashboardLayout title="Patient Details">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate('/admin/patients')}>
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </Button>

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-elevated overflow-hidden border-border/60">
          <div className="h-20 gradient-brand" />
          <CardContent className="p-6 pt-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card gradient-violet text-3xl font-bold text-white shadow-lg">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1 sm:pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {patient.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {patient.phone}</span>
                  <span className="flex items-center gap-1.5"><Droplet className="h-3.5 w-3.5" /> {patient.bloodGroup}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {patient.address}</span>
                </div>
              </div>
              <div className="flex gap-2 sm:pb-1">
                <Button variant="outline" size="sm" className="gap-1.5"><Calendar className="h-4 w-4" /> Book</Button>
                <Button size="sm" className="gap-1.5"><Pill className="h-4 w-4" /> Prescribe</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="mb-4 flex w-full flex-wrap justify-start gap-1 bg-muted/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {vitals.map((vital, i) => (
              <motion.div key={vital.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="card-elevated border-border/60">
                  <CardContent className="p-4">
                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${vital.gradient}`}>
                      <vital.icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{vital.label}</p>
                    <p className="text-lg font-bold text-foreground">
                      {vital.value} <span className="text-xs font-normal text-muted-foreground">{vital.unit}</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="card-elevated border-border/60">
              <CardHeader><CardTitle className="text-base">Next Appointment</CardTitle></CardHeader>
              <CardContent>
                {nextAppt ? (
                  <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-brand text-white">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{nextAppt.date} at {nextAppt.time}</p>
                      <p className="text-sm text-muted-foreground">{nextAppt.type} · {nextAppt.doctorName}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                )}
              </CardContent>
            </Card>
            <Card className="card-elevated border-border/60">
              <CardHeader><CardTitle className="text-base">Recent Prescriptions</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prescriptions.slice(0, 3).map((rx) => (
                    <div key={rx.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{rx.medication}</p>
                          <p className="text-xs text-muted-foreground">{rx.dosage}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{rx.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="card-elevated border-border/60">
            <CardContent className="p-6">
              <div className="relative space-y-6 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                {medicalHistory.map((item, index) => (
                  <div key={index} className="relative flex gap-4">
                    <div className="z-10 mt-1 h-3 w-3 flex-shrink-0 rounded-full gradient-brand ring-4 ring-card" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.event}</p>
                      <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                        <span>{item.date}</span>
                        <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {item.doctor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="card-elevated border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {['Date', 'Time', 'Doctor', 'Type', 'Status'].map((h) => (
                        <th key={h} className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patientAppointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-border/60 last:border-0">
                        <td className="p-4 text-sm text-foreground">{apt.date}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.time}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.doctorName}</td>
                        <td className="p-4 text-sm text-muted-foreground">{apt.type}</td>
                        <td className="p-4"><StatusBadge status={apt.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {patientAppointments.length === 0 && <EmptyState icon={Calendar} title="No appointments" />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card className="card-elevated border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {['Medication', 'Dosage', 'Prescribed By', 'Date', ''].map((h, i) => (
                        <th key={i} className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((rx) => (
                      <tr key={rx.id} className="border-b border-border/60 last:border-0">
                        <td className="p-4 text-sm font-medium text-foreground">{rx.medication}</td>
                        <td className="p-4 text-sm text-muted-foreground">{rx.dosage}</td>
                        <td className="p-4 text-sm text-muted-foreground">{rx.prescribedBy}</td>
                        <td className="p-4 text-sm text-muted-foreground">{rx.date}</td>
                        <td className="p-4"><Button variant="ghost" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> PDF</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="card-elevated border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {['Invoice #', 'Date', 'Amount', 'Status'].map((h) => (
                        <th key={h} className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patientInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/60 last:border-0">
                        <td className="p-4 text-sm font-medium text-foreground">{inv.invoiceNumber}</td>
                        <td className="p-4 text-sm text-muted-foreground">{inv.createdAt}</td>
                        <td className="p-4 text-sm font-semibold text-foreground">${inv.total.toFixed(2)}</td>
                        <td className="p-4"><StatusBadge status={inv.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {patientInvoices.length === 0 && <EmptyState icon={FileText} title="No invoices" />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PatientDetail;
