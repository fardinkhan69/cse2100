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

import React, { useState, useEffect, useContext } from 'react';
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
  fetchDoctorByEmail,
  fetchAppointmentsByDoctorId,
  updateAppointmentBooking,
  Appointment as ApiAppointment
} from '@/services/api';
import PrescriptionModal from '@/components/PrescriptionModal';
import { AuthContext } from '@/components/AuthProvider';
import useAxiosSecure from '@/hooks/useAxiosSecure';

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
  const { user, signOutUser, isLoading: authLoading, tokenReady } = useContext(AuthContext);
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
  const axiosSecure = useAxiosSecure()

  // Redirect to login if user is not authenticated
  useEffect(() => {
    // Don't redirect while auth is still loading
    if (authLoading) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the doctor dashboard.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  }, [user, navigate, toast, authLoading]);

  // Fetch doctor data and appointments on component mount
  useEffect(() => {
    // Don't make API calls if no user, auth loading, or token not ready
    if (!user || authLoading || !tokenReady) return;
    
    const fetchDoctorData = async () => {
      setIsLoadingData(true);
      setError(null);

      try {
        // Check if user is authenticated
        if (!user || !user.email) {
          throw new Error('You must be logged in to access the doctor dashboard.');
        }

        // Fetch the authenticated doctor's profile by email
        const doctor = await fetchDoctorByEmail(user.email);

        if (!doctor) {
          throw new Error(`No doctor profile found for ${user.email}. Please register as a doctor first.`);
        }

        setCurrentDoctorId(doctor._id);

        // Set doctor profile data
        setDoctorProfile({
          _id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
          email: doctor.email || user.email,
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
  }, [toast, user, authLoading, tokenReady]);

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
  const handleLogout = async () => {
    try {
      setIsMobileMenuOpen(false);
      await signOutUser();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
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

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-medical-medium border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Checking Authentication</h2>
          <p className="text-gray-500">Please wait while we verify your credentials...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 relative"
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo - Always visible */}
          <div
            className="flex items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
            onClick={() => handleNavigation('/')}
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-medical-medium flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">RUET Medical Center</h1>
              <p className="text-xs md:text-sm text-gray-600">Doctor Dashboard</p>
            </div>
            <div className="block sm:hidden min-w-0">
              <h1 className="text-sm font-bold text-gray-800 truncate">RUET Medical</h1>
              <p className="text-xs text-gray-600">Doctor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 lg:h-11 lg:w-11"
              onClick={handleNotifications}
              title="Notifications"
            >
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 lg:h-3 lg:w-3 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:h-11 lg:w-11"
              onClick={handleSettings}
              title="Settings"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:h-11 lg:w-11"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
            <div className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-gray-200 min-w-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-medical-light rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-medical-dark" />
              </div>
              <div className="text-right min-w-0">
                <p className="text-xs lg:text-sm font-semibold text-gray-800 truncate max-w-24 lg:max-w-none">{doctorProfile.name}</p>
                <p className="text-xs text-gray-600 truncate max-w-24 lg:max-w-none">{doctorProfile.specialization}</p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 sm:h-10 sm:w-10"
            onClick={toggleMobileMenu}
            title="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
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
              <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
                {/* User Profile Section */}
                <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-medical-light rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-medical-dark" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{doctorProfile.name}</p>
                    <p className="text-xs text-gray-600 truncate">{doctorProfile.specialization}</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-1 sm:space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 sm:h-12 text-left text-sm sm:text-base"
                    onClick={handleNotifications}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Notifications
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 sm:h-12 text-left text-sm sm:text-base"
                    onClick={handleSettings}
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Settings
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10 sm:h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50 text-sm sm:text-base"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Mobile Tab Navigation */}
              <div className="block md:hidden">
                <TabsList className="grid grid-cols-3 w-full h-11 sm:h-12 bg-gray-100">
                  <TabsTrigger value="upcoming" className="font-medium text-xs sm:text-sm px-1 sm:px-2">
                    <div className="text-center">
                      <div>Upcoming</div>
                      <div className="text-xs text-gray-500">({upcomingAppointments.length})</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="past" className="font-medium text-xs sm:text-sm px-1 sm:px-2">
                    <div className="text-center">
                      <div>Past</div>
                      <div className="text-xs text-gray-500">({pastAppointments.length})</div>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="font-medium text-xs sm:text-sm px-1 sm:px-2">
                    Profile
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Desktop Tab Navigation */}
              <div className="hidden md:flex justify-between items-center gap-4">
                <TabsList className="grid grid-cols-3 w-full max-w-md h-11 lg:h-12 bg-gray-100">
                  <TabsTrigger value="upcoming" className="font-medium text-sm lg:text-base px-2 lg:px-4">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="font-medium text-sm lg:text-base px-2 lg:px-4">
                    Past ({pastAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="font-medium text-sm lg:text-base px-2 lg:px-4">
                    Profile
                  </TabsTrigger>
                </TabsList>

                {/* Desktop Search Bar */}
                {(activeTab === 'upcoming' || activeTab === 'past') && (
                  <div className="relative w-full max-w-xs lg:max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 lg:h-12 text-sm lg:text-base"
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
                      className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Appointments Tab */}
            <TabsContent value="upcoming" className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Upcoming Appointments</h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 w-fit text-xs sm:text-sm">
                  {upcomingAppointments.length} appointments
                </Badge>
              </div>

              {upcomingAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 sm:py-12 px-4"
                >
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No upcoming appointments</h3>
                  <p className="text-sm sm:text-base text-gray-500">All caught up! No pending appointments to review.</p>
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
                        <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                          {/* Mobile Layout */}
                          <div className="block md:hidden space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-medical-light rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-medical-dark" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-base sm:text-lg text-gray-800 truncate">{appointment.patientName}</CardTitle>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {appointment.userEmail}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
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

                            <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-medical-medium flex-shrink-0" />
                                <span className={`truncate ${isToday(appointment.appointmentDate) ? 'font-semibold text-medical-dark' : ''}`}>
                                  {formatDate(appointment.appointmentDate)}
                                </span>
                                {isToday(appointment.appointmentDate) && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs flex-shrink-0">Today</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-medical-medium flex-shrink-0" />
                                <span>{appointment.appointmentTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:block">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-medical-light rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-medical-dark" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <CardTitle className="text-base lg:text-lg text-gray-800 truncate">{appointment.patientName}</CardTitle>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                                      <Mail className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">{appointment.userEmail}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 lg:gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <Calendar className="w-4 h-4 text-medical-medium flex-shrink-0" />
                                    <span className={`truncate ${isToday(appointment.appointmentDate) ? 'font-semibold text-medical-dark' : ''}`}>
                                      {formatDate(appointment.appointmentDate)}
                                    </span>
                                    {isToday(appointment.appointmentDate) && (
                                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 flex-shrink-0">Today</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Clock className="w-4 h-4 text-medical-medium" />
                                    <span>{appointment.appointmentTime}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                {appointment.booking ? (
                                  <Badge className="bg-green-100 text-green-700 text-xs lg:text-sm">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs lg:text-sm">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Problem Description:</Label>
                              <p className="text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg text-xs sm:text-sm leading-relaxed">
                                {appointment.problemDescription}
                              </p>
                            </div>

                            {!appointment.booking && (
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-2">
                                <Button
                                  onClick={() => handleApproveAppointment(appointment._id)}
                                  disabled={isLoading}
                                  className="bg-medical-medium hover:bg-medical-dark text-white h-9 sm:h-10 lg:h-11 px-4 sm:px-6 text-xs sm:text-sm lg:text-base"
                                >
                                  {isLoading ? (
                                    <>
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      <span className="hidden sm:inline">Approving...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                      <span className="hidden sm:inline">Approve Appointment</span>
                                      <span className="sm:hidden">Approve</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                            {appointment.booking && (
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center justify-between pt-2">
                                <div className="text-xs sm:text-sm text-green-600 font-medium flex items-center">
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  <span>Appointment Approved</span>
                                </div>
                                <Button
                                  onClick={() => handleOpenPrescriptionModal(appointment)}
                                  variant="outline"
                                  className="border-medical-medium text-medical-medium hover:bg-medical-medium hover:text-white h-9 sm:h-10 lg:h-11 px-4 sm:px-6 text-xs sm:text-sm lg:text-base w-full sm:w-auto"
                                >
                                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
            <TabsContent value="past" className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Past Appointments</h2>
                <Badge variant="secondary" className="bg-green-100 text-green-700 w-fit text-xs sm:text-sm">
                  {pastAppointments.length} completed
                </Badge>
              </div>

              {pastAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 sm:py-12 px-4"
                >
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No past appointments</h3>
                  <p className="text-sm sm:text-base text-gray-500">Your appointment history will appear here.</p>
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
                        <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                          {/* Mobile Layout */}
                          <div className="block md:hidden space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-base sm:text-lg text-gray-800 truncate">{appointment.patientName}</CardTitle>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {appointment.userEmail}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 text-xs flex-shrink-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            </div>

                            <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                                <span className="truncate">{formatDate(appointment.appointmentDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                                <span>{appointment.appointmentTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:block">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <CardTitle className="text-base lg:text-lg text-gray-800 truncate">{appointment.patientName}</CardTitle>
                                    <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
                                      <Mail className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">{appointment.userEmail}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 lg:gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="truncate">{formatDate(appointment.appointmentDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span>{appointment.appointmentTime}</span>
                                  </div>
                                </div>
                              </div>

                              <Badge className="bg-green-100 text-green-700 text-xs lg:text-sm flex-shrink-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div>
                            <Label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">Problem Description:</Label>
                            <p className="text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg text-xs sm:text-sm leading-relaxed">
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
            <TabsContent value="profile" className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Doctor Profile</h2>
                <Badge variant="secondary" className="bg-medical-light text-medical-dark w-fit text-xs sm:text-sm">
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
                  <CardHeader className="bg-gradient-to-r from-medical-medium to-medical-dark text-white p-3 sm:p-4 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg md:text-xl text-white truncate">{doctorProfile.name}</CardTitle>
                        <p className="text-sm md:text-base text-white/90 truncate">{doctorProfile.specialization}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 sm:p-4 md:p-8">
                    <form onSubmit={handleProfileUpdate} className="space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={doctorProfile.name}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, name: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialization" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Specialization
                          </Label>
                          <Input
                            id="specialization"
                            value={doctorProfile.specialization}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, specialization: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Experience
                          </Label>
                          <Input
                            id="experience"
                            value={doctorProfile.experience}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, experience: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="qualifications" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Qualifications
                          </Label>
                          <Input
                            id="qualifications"
                            value={doctorProfile.qualifications}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, qualifications: e.target.value }))}
                            className="border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                          />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                            <Input
                              id="email"
                              type="email"
                              value={doctorProfile.email}
                              onChange={(e) => setDoctorProfile(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-9 sm:pl-10 border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-gray-700">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                            <Input
                              id="phone"
                              value={doctorProfile.phone}
                              onChange={(e) => setDoctorProfile(prev => ({ ...prev, phone: e.target.value }))}
                              className="pl-9 sm:pl-10 border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address" className="text-xs sm:text-sm font-semibold text-gray-700">
                          Address
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                          <Input
                            id="address"
                            value={doctorProfile.address}
                            onChange={(e) => setDoctorProfile(prev => ({ ...prev, address: e.target.value }))}
                            className="pl-9 sm:pl-10 border-gray-300 focus:border-medical-medium h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bio" className="text-xs sm:text-sm font-semibold text-gray-700">
                          Professional Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={doctorProfile.bio}
                          onChange={(e) => setDoctorProfile(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className="border-gray-300 focus:border-medical-medium resize-none text-xs sm:text-sm lg:text-base min-h-[80px] sm:min-h-[100px]"
                          placeholder="Tell patients about your expertise and approach to healthcare..."
                        />
                      </div>

                      <div className="flex justify-end pt-3 sm:pt-4 sm:col-span-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-medical-medium hover:bg-medical-dark text-white px-4 sm:px-6 md:px-8 h-9 sm:h-10 lg:h-11 w-full sm:w-auto text-sm sm:text-base"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
