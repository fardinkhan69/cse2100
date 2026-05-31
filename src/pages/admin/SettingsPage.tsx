import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockClinicSettings, type WorkingHour, type Holiday, type ClinicService } from '@/services/mockData';

const SettingsPage = () => {
  const { toast } = useToast();
  const [general, setGeneral] = useState(mockClinicSettings.general);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(mockClinicSettings.workingHours);
  const [holidays, setHolidays] = useState<Holiday[]>(mockClinicSettings.holidays);
  const [services, setServices] = useState<ClinicService[]>(mockClinicSettings.services);
  const [holidayDialog, setHolidayDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });
  const [newService, setNewService] = useState({ name: '', duration: 30, price: 0 });

  const handleSaveGeneral = () => {
    toast({ title: 'Settings Saved', description: 'General settings have been updated.' });
  };

  const toggleDayOff = (index: number) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], isOff: !updated[index].isOff };
    setWorkingHours(updated);
  };

  const updateHours = (index: number, field: 'start' | 'end', value: string) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  const addHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      setHolidays([...holidays, { id: Date.now().toString(), ...newHoliday }]);
      setNewHoliday({ name: '', date: '' });
      setHolidayDialog(false);
      toast({ title: 'Holiday Added' });
    }
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const addService = () => {
    if (newService.name) {
      setServices([...services, { id: Date.now().toString(), ...newService }]);
      setNewService({ name: '', duration: 30, price: 0 });
      setServiceDialog(false);
      toast({ title: 'Service Added' });
    }
  };

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <DashboardLayout title="Settings">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Clinic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div>
                <Label>Clinic Name</Label>
                <Input value={general.name} onChange={(e) => setGeneral({ ...general, name: e.target.value })} />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} />
              </div>
              <Button className="bg-medical-medium hover:bg-medical-dark" onClick={handleSaveGeneral}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workingHours.map((wh, index) => (
                  <div key={wh.day} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-2 border-b last:border-0">
                    <span className="w-28 text-sm font-medium">{wh.day}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={wh.start}
                        onChange={(e) => updateHours(index, 'start', e.target.value)}
                        disabled={wh.isOff}
                        className="w-32"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <Input
                        type="time"
                        value={wh.end}
                        onChange={(e) => updateHours(index, 'end', e.target.value)}
                        disabled={wh.isOff}
                        className="w-32"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={wh.isOff} onCheckedChange={() => toggleDayOff(index)} />
                      <span className="text-xs text-gray-500">Day off</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-medical-medium hover:bg-medical-dark" onClick={() => toast({ title: 'Hours Saved' })}>
                Save Hours
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Holidays</CardTitle>
              <Dialog open={holidayDialog} onOpenChange={setHolidayDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-medical-medium hover:bg-medical-dark">
                    <Plus className="w-4 h-4 mr-1" /> Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Holiday</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Holiday Name</Label>
                      <Input value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} />
                    </div>
                    <Button className="w-full bg-medical-medium hover:bg-medical-dark" onClick={addHoliday}>Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{holiday.name}</p>
                      <p className="text-xs text-gray-500">{holiday.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeHoliday(holiday.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Services</CardTitle>
              <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-medical-medium hover:bg-medical-dark">
                    <Plus className="w-4 h-4 mr-1" /> Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Service Name</Label>
                      <Input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input type="number" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <Button className="w-full bg-medical-medium hover:bg-medical-dark" onClick={addService}>Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.duration} min - ${service.price}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeService(service.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;
