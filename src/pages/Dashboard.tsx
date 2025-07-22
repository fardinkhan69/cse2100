
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

import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  FileText,
  Download,
  Pill,
  Stethoscope,
  Eye,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fetchPrescriptionsByPatient, type Prescription } from '@/services/api';
import { generatePrescriptionPDF } from '@/utils/pdfGenerator';
import axios from 'axios';
import useAxiosSecure from '@/hooks/useAxiosSecure';

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
  const { user, signOutUser, isLoading, tokenReady } = useContext(AuthContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('appointments');
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    studentId: '2020-04-001',
    email: user.email,
    phone: '+880 1712-345678',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    bloodGroup: 'B+',
    emergencyContact: '+880 1756-789012'
  });
  const [upcomingAppointment, setUpcomingAppointment] = useState([]);
  const [previousAppointment, setPreviousAppointment] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState<{[key: string]: boolean}>({});
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Get user display information from Firebase user object
  const getUserDisplayInfo = () => {
    if (user) {
      const displayName = user.displayName || user.email?.split('@')[0] || 'User';
      const email = user.email || 'No email available';
      return { name: displayName, email };
    }
    // Fallback to static data if no user
    return { name: 'No user', email: 'please log in' };
  };

  

  useEffect(() => {
    // Don't make API calls if no user, still loading auth, or token not ready
    if (!user || isLoading || !tokenReady) return;
    
    const fetchComponent = async () => {
      setIsLoadingAppointments(true);
      try {
        const res = await axiosSecure.get(`/appointments`, {
          params: { email: user.email }
        });
        const appointments = res.data.data;
        let upcoming = [];
        let previous = [];
        let newAppointments=[]

        const now = new Date();

        const enrichedAppointments = await Promise.all(
          appointments.map(async (appt) => {
            try {
              const doctorRes = await axiosSecure.get(`/doctors/${appt.doctorId}`);
              return {
                ...appt,
                roomNo : Math.floor(Math.random() * (300 - 100 + 1)) + 100,
                doctorInfo: doctorRes.data.data
              };
              
            } catch (err) {
              console.error(`Failed to fetch doctor for ID ${appt.doctorId}`, err);
              return appt; // Fallback without doctor data
            }
          })
        );

        


        enrichedAppointments.forEach(appt => {
          const combinedDateTimeStr = `${appt.appointmentDate} ${appt.appointmentTime}`;
          const appointmentDateTime = new Date(combinedDateTimeStr);

          if (appointmentDateTime > now) {
            upcoming.push(appt);
          } else {
            previous.push(appt);
          }
        });

        setUpcomingAppointment(upcoming);
        setPreviousAppointment(previous);

        // Fetch prescriptions for the user
        try {
          const userPrescriptions = await fetchPrescriptionsByPatient(user.email);
          setPrescriptions(userPrescriptions);
        } catch (error) {
          console.error('Error fetching prescriptions:', error);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingAppointments(false);
      }
    }
    fetchComponent();
    
  }, [user, isLoading, tokenReady]);
  

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

  const handleEditAppointment = (appointmentId: string) => {
    console.log('Edit appointment:', appointmentId);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleCancelAppointment = async(appointmentId: string) => {
    console.log('Cancel appointment:', appointmentId);
    try{
      const res = await axiosSecure.delete(`/appointments/${appointmentId}`);
      console.log(res);
      const updatedAppointments = upcomingAppointment.filter((appt) => appt._id !== appointmentId);
      setUpcomingAppointment(updatedAppointments);

      // Show success modal instead of toast
      setShowSuccessModal(true);

      // Auto-hide modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);

    }catch(err){
      console.log(err);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to check if prescription exists for an appointment
  const getPrescriptionForAppointment = (appointmentId: string): Prescription | null => {
    const prescription = prescriptions.find(prescription => {
      // Handle both string and object appointmentId
      let prescriptionAppointmentId: string;

      if (typeof prescription.appointmentId === 'string') {
        prescriptionAppointmentId = prescription.appointmentId;
      } else if (prescription.appointmentId && typeof prescription.appointmentId === 'object' && '_id' in prescription.appointmentId) {
        prescriptionAppointmentId = (prescription.appointmentId as any)._id;
      } else {
        prescriptionAppointmentId = String(prescription.appointmentId);
      }

      return prescriptionAppointmentId === appointmentId;
    });

    return prescription || null;
  };

  // Handle viewing prescription
  const handleViewPrescription = (appointmentId: string) => {
    const prescription = getPrescriptionForAppointment(appointmentId);
    if (prescription) {
      setSelectedPrescription(prescription);
      setPrescriptionModalOpen(true);
    }
  };

  // Handle closing prescription modal
  const handleClosePrescriptionModal = () => {
    setPrescriptionModalOpen(false);
    setSelectedPrescription(null);
  };

  // Handle PDF download
  const handleDownloadPDF = (prescription: Prescription) => {
    try {
      generatePrescriptionPDF(prescription);
      toast({
        title: "PDF Downloaded",
        description: `Prescription PDF for ${prescription.patientName} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <div className="flex items-center gap-4" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
              <p className="font-semibold text-gray-800">{getUserDisplayInfo().name}</p>
              <p className="text-sm text-gray-600">{getUserDisplayInfo().email}</p>
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
              <TabsTrigger value="appointments" className="font-medium">appointments</TabsTrigger>
              <TabsTrigger value="previous" className="font-medium">Previous</TabsTrigger>
              <TabsTrigger value="profile" className="font-medium">Profile</TabsTrigger>
            </TabsList>

            {/* Upcoming Appointments Tab */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800"> Appointments</h2>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-medical-medium hover:bg-medical-dark"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
              </div>

              <div className="grid gap-6">
                {isLoadingAppointments ? (
                  // Loading state
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-medical-light rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-medical-medium border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading your appointments...</p>
                      <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
                    </motion.div>
                  </div>
                ) : upcomingAppointment.length === 0 ? (
                  // Empty state
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Upcoming Appointments</h3>
                    <p className="text-gray-600 mb-6">You don't have any upcoming appointments scheduled.</p>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-medical-medium hover:bg-medical-dark"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Your First Appointment
                    </Button>
                  </motion.div>
                ) : (
                  upcomingAppointment.map((appointment, index) => (
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
                            <CardTitle className="text-lg text-gray-800">{appointment.doctorInfo.name}</CardTitle>
                            <CardDescription className="text-medical-dark font-medium">
                              {appointment.doctorInfo.specialization}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            {getPrescriptionForAppointment(appointment._id) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewPrescription(appointment._id)}
                                className="border-medical-medium text-medical-medium hover:bg-medical-medium hover:text-white p-2"
                                title="View Prescription"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
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
                              onClick={() => handleCancelAppointment(appointment._id)}
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
                            <span className="text-sm font-medium">{appointment.appointmentDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.appointmentTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.roomNo}</span>
                          </div>
                          <div>
                            <Badge
                              variant={appointment.booking === true ? 'default' : 'secondary'}
                              className={appointment.booking === true ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                            >
                              {appointment.booking === true && <CheckCircle className="w-3 h-3 mr-1" />}
                              {appointment.booking === false && <AlertCircle className="w-3 h-3 mr-1" />}
                              {appointment.booking ? "Confirmed" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {appointment.problemDescription.length > 30 ? appointment.problemDescription.slice(0, 30) + "..." : appointment.problemDescription}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Previous Appointments Tab */}
            <TabsContent value="previous" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Previous Appointments</h2>

              <div className="grid gap-6">
                {isLoadingAppointments ? (
                  // Loading state
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-medical-light rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-medical-medium border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading your appointment history...</p>
                      <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
                    </motion.div>
                  </div>
                ) : previousAppointment.length === 0 ? (
                  // Empty state
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Previous Appointments</h3>
                    <p className="text-gray-600 mb-6">You haven't completed any appointments yet.</p>
                  </motion.div>
                ) : (
                  previousAppointment.map((appointment, index) => (
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
                            <CardTitle className="text-lg text-gray-800">{appointment.doctorInfo.name}</CardTitle>
                            <CardDescription className="text-medical-dark font-medium">
                             {appointment.doctorInfo.specialization}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                            {getPrescriptionForAppointment(appointment._id) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewPrescription(appointment._id)}
                                className="border-medical-medium text-medical-medium hover:bg-medical-medium hover:text-white"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Prescription
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.appointmentDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{appointment.appointmentTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Reason:</span> {appointment.problemDescription.length > 30 ? appointment.problemDescription.slice(0, 30) + "..." : appointment.problemDescription}
                            </p>
                          </div>
                          {getPrescriptionForAppointment(appointment._id) ? (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-green-700">Prescription Available</span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewPrescription(appointment._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </div>
                              <p className="text-sm text-green-600 mt-2">
                                Click "View Details" to see your complete prescription and download PDF
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Status:</span> No prescription available for this appointment
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  ))
                )}
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
                          value={getUserDisplayInfo().name}
                          disabled
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
                          value={getUserDisplayInfo().email}
                          disabled

                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
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
                          onChange={(e) => setUserInfo({ ...userInfo, bloodGroup: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={userInfo.emergencyContact}
                          onChange={(e) => setUserInfo({ ...userInfo, emergencyContact: e.target.value })}
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Check Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.4,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                Appointment Cancelled
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-gray-600 mb-6"
              >
                Your appointment has been successfully cancelled.
              </motion.p>

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg"
                >
                  OK
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prescription Modal */}
      <Dialog open={prescriptionModalOpen} onOpenChange={handleClosePrescriptionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-medical-dark">
              <FileText className="w-6 h-6" />
              Medical Prescription
            </DialogTitle>
            <DialogDescription>
              {selectedPrescription && `Prescription details for ${selectedPrescription.patientName}`}
            </DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-6">
              {/* Header with Download Button */}
              <div className="flex justify-between items-center p-4 bg-medical-light/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-medical-medium rounded-full flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">RUET Medical Center</h3>
                    <p className="text-sm text-gray-600">Medical Prescription</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownloadPDF(selectedPrescription)}
                  className="bg-medical-medium hover:bg-medical-dark text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Patient Information</h4>
                  <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedPrescription.patientName}</p>
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {selectedPrescription.patientId}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Doctor Information</h4>
                  <p className="text-gray-600"><span className="font-medium">Doctor:</span> {selectedPrescription.doctorName}</p>
                  <p className="text-gray-600"><span className="font-medium">Date:</span> {formatDate(selectedPrescription.date)}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Symptoms</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedPrescription.symptoms}</p>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Diagnosis</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedPrescription.diagnosis}</p>
              </div>

              {/* Medications */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-medical-medium" />
                  Prescribed Medications ({selectedPrescription.medications.length})
                </h4>
                <div className="space-y-3">
                  {selectedPrescription.medications.map((medication, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <span className="font-medium text-gray-700">{medication.name}</span>
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Dosage:</span> {medication.dosage}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Frequency:</span> {medication.frequency}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Duration:</span> {medication.duration}
                        </div>
                      </div>
                      {medication.instructions && (
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Instructions:</span> {medication.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Advice */}
              {selectedPrescription.advice && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Medical Advice</h4>
                  <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{selectedPrescription.advice}</p>
                </div>
              )}

              {/* Follow-up */}
              {selectedPrescription.followUpDate && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Follow-up</h4>
                  <Badge variant="outline" className="text-medical-medium border-medical-medium">
                    {selectedPrescription.followUpDate}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
