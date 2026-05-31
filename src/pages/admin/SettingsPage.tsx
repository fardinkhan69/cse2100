import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/admin/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus, Trash2, Settings as SettingsIcon, Clock, CalendarOff, Stethoscope, Moon, Sun, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockClinicSettings, type WorkingHour, type Holiday, type ClinicService } from '@/services/mockData';

const SettingsPage = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [general, setGeneral] = useState(mockClinicSettings.general);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(mockClinicSettings.workingHours);
  const [holidays, setHolidays] = useState<Holiday[]>(mockClinicSettings.holidays);
  const [services, setServices] = useState<ClinicService[]>(mockClinicSettings.services);
  const [holidayDialog, setHolidayDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });
  const [newService, setNewService] = useState({ name: '', duration: 30, price: 0 });

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
  const removeHoliday = (id: string) => setHolidays(holidays.filter((h) => h.id !== id));
  const addService = () => {
    if (newService.name) {
      setServices([...services, { id: Date.now().toString(), ...newService }]);
      setNewService({ name: '', duration: 30, price: 0 });
      setServiceDialog(false);
      toast({ title: 'Service Added' });
    }
  };
  const removeService = (id: string) => setServices(services.filter((s) => s.id !== id));

  return (
    <DashboardLayout title="Settings">
      <PageHeader title="Settings" description="Configure your clinic preferences." icon={<SettingsIcon className="h-5 w-5" />} />

      {/* Appearance card */}
      <Card className="card-elevated mb-6 border-border/60">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-violet text-white shadow-md">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Appearance</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general">
        <TabsList className="mb-6 bg-muted/60">
          <TabsTrigger value="general"><Building2 className="mr-1.5 h-4 w-4" />General</TabsTrigger>
          <TabsTrigger value="hours"><Clock className="mr-1.5 h-4 w-4" />Hours</TabsTrigger>
          <TabsTrigger value="holidays"><CalendarOff className="mr-1.5 h-4 w-4" />Holidays</TabsTrigger>
          <TabsTrigger value="services"><Stethoscope className="mr-1.5 h-4 w-4" />Services</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="card-elevated border-border/60">
            <CardHeader><CardTitle className="text-base">Clinic Information</CardTitle></CardHeader>
            <CardContent className="max-w-lg space-y-4">
              <div className="space-y-1.5"><Label>Clinic Name</Label><Input value={general.name} onChange={(e) => setGeneral({ ...general, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Address</Label><Input value={general.address} onChange={(e) => setGeneral({ ...general, address: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} /></div>
              <Button onClick={() => toast({ title: 'Settings Saved', description: 'General settings have been updated.' })}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="card-elevated border-border/60">
            <CardHeader><CardTitle className="text-base">Working Hours</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workingHours.map((wh, index) => (
                  <div key={wh.day} className="flex flex-col items-start gap-3 rounded-xl border border-border/60 p-3 sm:flex-row sm:items-center">
                    <span className="w-28 text-sm font-semibold text-foreground">{wh.day}</span>
                    <div className="flex flex-1 items-center gap-2">
                      <Input type="time" value={wh.start} onChange={(e) => updateHours(index, 'start', e.target.value)} disabled={wh.isOff} className="w-32" />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input type="time" value={wh.end} onChange={(e) => updateHours(index, 'end', e.target.value)} disabled={wh.isOff} className="w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={wh.isOff} onCheckedChange={() => toggleDayOff(index)} />
                      <span className="text-xs text-muted-foreground">Day off</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={() => toast({ title: 'Hours Saved' })}>Save Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holidays">
          <Card className="card-elevated border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Holidays</CardTitle>
              <Dialog open={holidayDialog} onOpenChange={setHolidayDialog}>
                <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Holiday</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><Label>Holiday Name</Label><Input value={newHoliday.name} onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={newHoliday.date} onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })} /></div>
                    <Button className="w-full" onClick={addHoliday}>Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400"><CalendarOff className="h-4 w-4" /></div>
                      <div><p className="text-sm font-medium text-foreground">{holiday.name}</p><p className="text-xs text-muted-foreground">{holiday.date}</p></div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeHoliday(holiday.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card className="card-elevated border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Service Catalog</CardTitle>
              <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
                <DialogTrigger asChild><Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><Label>Service Name</Label><Input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Duration (minutes)</Label><Input type="number" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })} /></div>
                    <div className="space-y-1.5"><Label>Price ($)</Label><Input type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })} /></div>
                    <Button className="w-full" onClick={addService}>Add</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Stethoscope className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.duration} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">${service.price}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeService(service.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
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
