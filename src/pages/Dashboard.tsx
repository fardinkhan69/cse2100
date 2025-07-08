
/**
 * Student Dashboard Component
 * 
 * Main dashboard for students to manage their medical appointments
 * Features:
 * - Tabbed interface with three main sections
 * - Upcoming appointments with edit/cancel options
 * - Previous appointments history
 * - Profile information management
 * - Modern card-based design with animations
 */

import React, { useState, useContext } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  Edit, 
  X, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

// Mock data for appointments and user info
const upcomingAppointments = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Ahmed',
    specialization: 'Cardiologist',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'Confirmed',
    reason: 'Regular checkup',
    location: 'Room 205'
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Rahman',
    specialization: 'Dermatologist',
    date: '2024-01-18',
    time: '2:30 PM',
    status: 'Pending',
    reason: 'Skin consultation',
    location: 'Room 312'
  }
];

const previousAppointments = [
  {
    id: '3',
    doctorName: 'Dr. Fatima Khan',
    specialization: 'General Medicine',
    date: '2024-01-05',
    time: '11:00 AM',
    status: 'Completed',
    reason: 'Fever and cold',
    prescription: 'Paracetamol, Rest for 3 days'
  },
  {
    id: '4',
    doctorName: 'Dr. John Smith',
    specialization: 'Orthopedic',
    date: '2024-01-02',
    time: '9:15 AM',
    status: 'Completed',
    reason: 'Knee pain',
    prescription: 'Physiotherapy recommended'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOutUser } = useContext(AuthContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [userInfo, setUserInfo] = useState({
    name: 'Ahmed Hassan',
    studentId: '2020-04-001',
    email: 'ahmed.hassan@student.ruet.ac.bd',
    phone: '+880 1712-345678',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    bloodGroup: 'B+',
    emergencyContact: '+880 1756-789012'
  });

  const handleEditAppointment = (appointmentId: string) => {
    console.log('Edit appointment:', appointmentId);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleCancelAppointment = (appointmentId: string) => {
    console.log('Cancel appointment:', appointmentId);
    // TODO: Show confirmation dialog and cancel appointment
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4" onClick={() => navigate('/')} style={{cursor:'pointer'}}>
            <div className="h-10 w-10 rounded-full bg-medical-medium flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">RUET Medical Center</h1>
              <p className="text-sm text-gray-600">Student Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{userInfo.name}</p>
              <p className="text-sm text-gray-600">{userInfo.studentId}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            
            {/* Tab Navigation */}
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto h-12 bg-gray-100">
              <TabsTrigger value="upcoming" className="font-medium">Upcoming</TabsTrigger>
              <TabsTrigger value="previous" className="font-medium">Previous</TabsTrigger>
              <TabsTrigger value="profile" className="font-medium">Profile</TabsTrigger>
            </TabsList>

            {/* Upcoming Appointments Tab */}
            <TabsContent value="upcoming" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-medical-medium hover:bg-medical-dark"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
              </div>

              <div className="grid gap-6">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-gray-800">{appointment.doctorName}</CardTitle>
                            <CardDescription className="text-medical-dark font-medium">
                              {appointment.specialization}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditAppointment(appointment.id)}
                              className="p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="p-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.location}</span>
                          </div>
                          <div>
                            <Badge 
                              variant={appointment.status === 'Confirmed' ? 'default' : 'secondary'}
                              className={appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                            >
                              {appointment.status === 'Confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {appointment.status === 'Pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Previous Appointments Tab */}
            <TabsContent value="previous" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Previous Appointments</h2>

              <div className="grid gap-6">
                {previousAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-gray-800">{appointment.doctorName}</CardTitle>
                            <CardDescription className="text-medical-dark font-medium">
                              {appointment.specialization}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Reason:</span> {appointment.reason}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Prescription:</span> {appointment.prescription}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={userInfo.studentId}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={userInfo.department}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Academic Year</Label>
                        <Input
                          id="year"
                          value={userInfo.year}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input
                          id="bloodGroup"
                          value={userInfo.bloodGroup}
                          onChange={(e) => setUserInfo({...userInfo, bloodGroup: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={userInfo.emergencyContact}
                          onChange={(e) => setUserInfo({...userInfo, emergencyContact: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button className="bg-medical-medium hover:bg-medical-dark">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
