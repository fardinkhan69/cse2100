/**
 * Doctor Dashboard Component
 * 
 * Modern doctor dashboard for managing appointments and profile
 * Features:
 * - Tabbed interface with Upcoming Appointments, Past Appointments, and Profile
 * - Approve appointment functionality
 * - Professional medical design
 * - Responsive layout with smooth animations
 * - Uses dummy data for demonstration
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Search,
  Filter,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  fetchDoctors,
  fetchAppointmentsByDoctorId,
  updateAppointmentBooking,
  Appointment as ApiAppointment
} from '@/services/api';
import PrescriptionModal from '@/components/PrescriptionModal';

// Use the API Appointment interface
type Appointment = ApiAppointment;

// Doctor profile interface
interface DoctorProfile {
  _id?: string;
  name: string;
  specialization: string;
  experience: string;
  email: string;
  phone?: string;
  bio: string;
  qualifications?: string;
  address?: string;
  rating?: number;
  image?: string;
  availableSlots?: string[];
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>({
    name: '',
    specialization: '',
    experience: '',
    email: '',
    bio: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  // Fetch doctor data and appointments on component mount
  useEffect(() => {
    const fetchDoctorData = async () => {
      setIsLoadingData(true);
      setError(null);

      try {
        // Fetch all doctors to get the first one (in a real app, this would be based on authentication)
        const doctors = await fetchDoctors();

        if (doctors.length === 0) {
          throw new Error('No doctors found. Please register as a doctor first.');
        }

        // Use the first doctor for demo purposes (in real app, this would be the authenticated doctor)
        const doctor = doctors[0];
        setCurrentDoctorId(doctor._id);

        // Set doctor profile data
        setDoctorProfile({
          _id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
          email: doctor.email || '', // Use email from API if available
          bio: doctor.bio,
          rating: doctor.rating,
          image: doctor.image,
          availableSlots: doctor.availableSlots,
          phone: '+880 1712-345678', // Default phone
          qualifications: 'MBBS, FCPS', // Default qualifications
          address: 'RUET Medical Center, Rajshahi University of Engineering & Technology' // Default address
        });

        // Fetch appointments for this doctor
        const doctorAppointments = await fetchAppointmentsByDoctorId(doctor._id);
        setAppointments(doctorAppointments);

      } catch (error) {
        console.error('Error fetching doctor data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load doctor data';
        setError(errorMessage);

        toast({
          title: "Error Loading Data",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDoctorData();
  }, [toast]);

  // Filter appointments based on date only (not booking status)
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      // Show all appointments scheduled for today or future dates, regardless of approval status
      return appointmentDate >= today;
    }).filter(appointment =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getPastAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      // Show only appointments from past dates (regardless of approval status for historical record)
      return appointmentDate < today;
    }).filter(appointment =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  };

  // Handle appointment approval
  const handleApproveAppointment = async (appointmentId: string) => {
    setIsLoading(true);

    try {
      // Find the appointment being approved for better feedback
      const appointmentToApprove = appointments.find(apt => apt._id === appointmentId);

      // Update appointment booking status via API
      await updateAppointmentBooking(appointmentId, true);

      // Update the appointment status to approved
      setAppointments(prev =>
        prev.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, booking: true }
            : appointment
        )
      );

      toast({
        title: "Appointment Approved",
        description: `${appointmentToApprove?.patientName}'s appointment has been approved and will remain in your upcoming appointments.`,
      });
    } catch (error) {
      console.error('Error approving appointment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve appointment';

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prescription modal
  const handleOpenPrescriptionModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = () => {
    setPrescriptionModalOpen(false);
    setSelectedAppointment(null);
  };

  const handlePrescriptionSuccess = () => {
    // Optionally refresh appointments or show success message
    toast({
      title: "Success",
      description: "Prescription created successfully!",
    });
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if appointment is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return today.toDateString() === appointmentDate.toDateString();
  };

  // Handle logout
  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  // Handle settings
  const handleSettings = () => {
    setIsMobileMenuOpen(false);
    setActiveTab('profile');
    toast({
      title: "Settings",
      description: "Redirected to profile settings.",
    });
  };

  // Handle notifications
  const handleNotifications = () => {
    setIsMobileMenuOpen(false);
    toast({
      title: "Notifications",
      description: "No new notifications at this time.",
    });
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle navigation with mobile menu close
  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-medical-medium border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Doctor Dashboard</h2>
          <p className="text-gray-500">Fetching your appointments and profile information...</p>
        </div>
      </div>
    );
  }

  // Show error state if data fetching failed
  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-medical-medium hover:bg-medical-dark text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 relative"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo - Always visible */}
          <div
            className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('/')}
          >
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-medical-medium flex items-center justify-center">
              <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">RUET Medical Center</h1>
              <p className="text-xs md:text-sm text-gray-600">Doctor Dashboard</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-bold text-gray-800">RUET Medical</h1>
              <p className="text-xs text-gray-600">Doctor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-11 w-11"
              onClick={handleNotifications}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={handleSettings}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-medical-light rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-medical-dark" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{doctorProfile.name}</p>
                <p className="text-xs text-gray-600">{doctorProfile.specialization}</p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-11 w-11"
            onClick={toggleMobileMenu}
            title="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50"
            >
              <div className="px-4 py-4 space-y-4">
                {/* User Profile Section */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-medical-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{doctorProfile.name}</p>
                    <p className="text-xs text-gray-600">{doctorProfile.specialization}</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-left"
                    onClick={handleNotifications}
                  >
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-left"
                    onClick={handleSettings}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-col gap-4">
              {/* Mobile Tab Navigation */}
              <div className="block md:hidden">
                <TabsList className="grid grid-cols-3 w-full h-12 bg-gray-100">
                  <TabsTrigger value="upcoming" className="font-medium text-xs">
                    Upcoming
                    <span className="block text-xs text-gray-500">({upcomingAppointments.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="past" className="font-medium text-xs">
                    Past
                    <span className="block text-xs text-gray-500">({pastAppointments.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="font-medium text-xs">
                    Profile
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Desktop Tab Navigation */}
              <div className="hidden md:flex justify-between items-center">
                <TabsList className="grid grid-cols-3 w-full max-w-md h-12 bg-gray-100">
                  <TabsTrigger value="upcoming" className="font-medium">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="font-medium">
                    Past ({pastAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="font-medium">
                    Profile
                  </TabsTrigger>
                </TabsList>

                {/* Desktop Search Bar */}
                {(activeTab === 'upcoming' || activeTab === 'past') && (
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                )}
              </div>

              {/* Mobile Search Bar */}
              {(activeTab === 'upcoming' || activeTab === 'past') && (
                <div className="block md:hidden">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Appointments Tab */}
            <TabsContent value="upcoming" className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 w-fit">
                  {upcomingAppointments.length} appointments
                </Badge>
              </div>

              {upcomingAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-500">All caught up! No pending appointments to review.</p>
                </motion.div>
              ) : (
                <div className="grid gap-6">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-medical-medium">
                        <CardHeader className="pb-3 md:pb-4">
                          {/* Mobile Layout */}
                          <div className="block md:hidden space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-medical-dark" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg text-gray-800">{appointment.patientName}</CardTitle>
                                  <p className="text-sm text-gray-600 break-all">
                                    {appointment.userEmail}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {appointment.booking ? (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-medical-medium" />
                                <span className={isToday(appointment.appointmentDate) ? 'font-semibold text-medical-dark' : ''}>
                                  {formatDate(appointment.appointmentDate)}
                                </span>
                                {isToday(appointment.appointmentDate) && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Today</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-medical-medium" />
                                <span>{appointment.appointmentTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:block">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-medical-light rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-medical-dark" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg text-gray-800">{appointment.patientName}</CardTitle>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {appointment.userEmail}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-medical-medium" />
                                    <span className={isToday(appointment.appointmentDate) ? 'font-semibold text-medical-dark' : ''}>
                                      {formatDate(appointment.appointmentDate)}
                                    </span>
                                    {isToday(appointment.appointmentDate) && (
                                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">Today</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-medical-medium" />
                                    <span>{appointment.appointmentTime}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                {appointment.booking ? (
                                  <Badge className="bg-green-100 text-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Problem Description:</Label>
                              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">
                                {appointment.problemDescription}
                              </p>
                            </div>

                            {!appointment.booking && (
                              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                                <Button
                                  onClick={() => handleApproveAppointment(appointment._id)}
                                  disabled={isLoading}
                                  className="bg-medical-medium hover:bg-medical-dark text-white h-11 px-6 text-sm md:text-base"
                                >
                                  {isLoading ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      <span className="hidden sm:inline">Approving...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      <span className="hidden sm:inline">Approve Appointment</span>
                                      <span className="sm:hidden">Approve</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                            {appointment.booking && (
                              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                                <div className="text-sm text-green-600 font-medium flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  <span>Appointment Approved</span>
                                </div>
                                <Button
                                  onClick={() => handleOpenPrescriptionModal(appointment)}
                                  variant="outline"
                                  className="border-medical-medium text-medical-medium hover:bg-medical-medium hover:text-white h-11 px-6 text-sm md:text-base"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">Give Prescription</span>
                                  <span className="sm:hidden">Prescription</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Past Appointments Tab */}
            <TabsContent value="past" className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Past Appointments</h2>
                <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit">
                  {pastAppointments.length} completed
                </Badge>
              </div>

              {pastAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No past appointments</h3>
                  <p className="text-gray-500">Your appointment history will appear here.</p>
                </motion.div>
              ) : (
                <div className="grid gap-6">
                  {pastAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500 opacity-90">
                        <CardHeader className="pb-3 md:pb-4">
                          {/* Mobile Layout */}
                          <div className="block md:hidden space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg text-gray-800">{appointment.patientName}</CardTitle>
                                  <p className="text-sm text-gray-600 break-all">
                                    {appointment.userEmail}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            </div>

                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <span>{formatDate(appointment.appointmentDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span>{appointment.appointmentTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:block">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg text-gray-800">{appointment.patientName}</CardTitle>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {appointment.userEmail}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    <span>{formatDate(appointment.appointmentDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span>{appointment.appointmentTime}</span>
                                  </div>
                                </div>
                              </div>

                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Problem Description:</Label>
                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">
                              {appointment.problemDescription}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Doctor Profile</h2>
                <Badge variant="secondary" className="bg-medical-light text-medical-dark w-fit">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  Medical Professional
                </Badge>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-medical-medium to-medical-dark text-white p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl text-white">{doctorProfile.name}</CardTitle>
                        <p className="text-sm md:text-base text-white/90">{doctorProfile.specialization}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 md:p-8">
                    <form onSubmit={handleProfileUpdate} className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={doctorProfile.name}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, name: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-11 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialization" className="text-sm font-semibold text-gray-700">
                            Specialization
                          </Label>
                          <Input
                            id="specialization"
                            value={doctorProfile.specialization}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, specialization: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-11 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                            Experience
                          </Label>
                          <Input
                            id="experience"
                            value={doctorProfile.experience}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, experience: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-11 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="qualifications" className="text-sm font-semibold text-gray-700">
                            Qualifications
                          </Label>
                          <Input
                            id="qualifications"
                            value={doctorProfile.qualifications}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, qualifications: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-11 text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="email"
                              type="email"
                              value={doctorProfile.email}
                              onChange={(e) => setDoctorProfile(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-10 border-gray-300 focus:border-medical-medium h-11 text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="phone"
                              value={doctorProfile.phone}
                              onChange={(e) => setDoctorProfile(prev => ({ ...prev, phone: e.target.value }))}
                              className="pl-10 border-gray-300 focus:border-medical-medium h-11 text-base"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                          Address
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <Input
                            id="address"
                            value={doctorProfile.address}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, address: e.target.value }))}
                            className="pl-10 border-gray-300 focus:border-medical-medium h-11 text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                          Professional Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={doctorProfile.bio}
                          onChange={(e) => setDoctorProfile(prev => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                          className="border-gray-300 focus:border-medical-medium resize-none text-base"
                          placeholder="Tell patients about your expertise and approach to healthcare..."
                        />
                      </div>

                      <div className="flex justify-end pt-4 md:col-span-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-medical-medium hover:bg-medical-dark text-white px-6 md:px-8 h-11 w-full sm:w-auto text-base"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Save Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Prescription Modal */}
      {selectedAppointment && (
        <PrescriptionModal
          isOpen={prescriptionModalOpen}
          onClose={handleClosePrescriptionModal}
          appointment={selectedAppointment}
          doctorName={doctorProfile.name}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
