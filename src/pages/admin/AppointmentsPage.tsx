import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, List, Columns, Plus } from 'lucide-react';
import { mockAppointments } from '@/services/mockData';

type ViewMode = 'list' | 'calendar' | 'queue';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-gray-100 text-gray-800',
};

const AppointmentsPage = () => {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const appointmentsForDate = mockAppointments.filter((a) => a.date === selectedDate);

  const waitingAppts = mockAppointments.filter((a) => a.status === 'scheduled');
  const inProgressAppts = mockAppointments.filter((a) => a.status === 'in-progress');
  const completedAppts = mockAppointments.filter((a) => a.status === 'completed');

  return (
    <DashboardLayout title="Appointments">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={view === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('calendar')}
              className={view === 'calendar' ? 'bg-medical-medium' : ''}
            >
              <Calendar className="w-4 h-4 mr-1" /> Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className={view === 'list' ? 'bg-medical-medium' : ''}
            >
              <List className="w-4 h-4 mr-1" /> List
            </Button>
            <Button
              variant={view === 'queue' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('queue')}
              className={view === 'queue' ? 'bg-medical-medium' : ''}
            >
              <Columns className="w-4 h-4 mr-1" /> Queue
            </Button>
          </div>
          <Button className="bg-medical-medium hover:bg-medical-dark">
            <Plus className="w-4 h-4 mr-2" /> New Appointment
          </Button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Patient</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Doctor</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Time</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Type</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm font-medium">{apt.patientName}</td>
                      <td className="p-3 text-sm text-gray-600">{apt.doctorName}</td>
                      <td className="p-3 text-sm text-gray-600">{apt.date}</td>
                      <td className="p-3 text-sm text-gray-600">{apt.time}</td>
                      <td className="p-3 text-sm text-gray-600">{apt.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">January 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-gray-500 p-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for Jan 2024 starting on Monday */}
                  <div />
                  {daysInMonth.map((day) => {
                    const dateStr = `2024-01-${String(day).padStart(2, '0')}`;
                    const hasAppts = mockAppointments.some((a) => a.date === dateStr);
                    const isSelected = dateStr === selectedDate;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-2 text-sm rounded-lg relative ${
                          isSelected ? 'bg-medical-medium text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {day}
                        {hasAppts && (
                          <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : 'bg-medical-medium'
                          }`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointmentsForDate.length > 0 ? (
                    appointmentsForDate.map((apt) => (
                      <div key={apt.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{apt.patientName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[apt.status]}`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{apt.time} - {apt.doctorName}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No appointments for this date</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Queue View */}
      {view === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="secondary">Waiting ({waitingAppts.length})</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {waitingAppts.slice(0, 6).map((apt) => (
                <div key={apt.id} className="p-3 border rounded-lg bg-white">
                  <p className="text-sm font-medium">{apt.patientName}</p>
                  <p className="text-xs text-gray-500">{apt.time} - {apt.doctorName}</p>
                  <p className="text-xs text-gray-400 mt-1">{apt.type}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="secondary">In Progress ({inProgressAppts.length})</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {inProgressAppts.map((apt) => (
                <div key={apt.id} className="p-3 border rounded-lg bg-white">
                  <p className="text-sm font-medium">{apt.patientName}</p>
                  <p className="text-xs text-gray-500">{apt.time} - {apt.doctorName}</p>
                  <p className="text-xs text-gray-400 mt-1">{apt.type}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge variant="secondary">Completed ({completedAppts.length})</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {completedAppts.map((apt) => (
                <div key={apt.id} className="p-3 border rounded-lg bg-white">
                  <p className="text-sm font-medium">{apt.patientName}</p>
                  <p className="text-xs text-gray-500">{apt.time} - {apt.doctorName}</p>
                  <p className="text-xs text-gray-400 mt-1">{apt.type}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AppointmentsPage;
