
/**
 * Home Page - Doctor Appointment Booking System
 * 
 * This is the main landing page that displays:
 * - Hero section with call-to-action and modern animations
 * - Statistics section showing impact
 * - Grid of available doctors with their information
 * - Features section
 * - Testimonials section
 * 
 * The page uses React Query for potential future API integration
 * Currently uses static data from the doctors.ts file
 */

import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorCard from "@/components/DoctorCard";
import NavbarDemo from "@/components/resizable-navbar-demo";
import { motion } from "motion/react";
import HeroSection from "@/components/HeroSection";
import ImpactSection from "@/components/ImpactSection";
import ServicesSection from "@/components/ServicesSection";
import ModernTestimonialsSection from "@/components/ModernTestimonialsSection";
import FooterCTA from "@/components/FooterCTA";
import AboutSection from "@/components/AboutSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "@/services/api";
import SectionSwapy from "@/components/SectionSwapy";
import MagicBento from "@/components/MagicBento";



/**
 * Index Component - Main Home Page
 *
 * Features:
 * - Responsive design with Tailwind CSS
 * - Hero section with gradient background and animations
 * - Doctor cards grid layout
 * - Navigation to individual booking pages
 * - Uses improved medical theme colors
 * - Fetches doctors data from API
 */
const Index = () => {
  const navigate = useNavigate();

  // Fetch doctors data using React Query
  const {
    data: doctors = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  /**
   * Handle navigation to booking page for specific doctor
   * @param doctorId - The unique identifier of the doctor
   */
  const handleBookAppointment = (doctorId: string) => {
    navigate(`/book/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-medical-light/20">
      {/* Navigation Bar */}
      <NavbarDemo />

      {/* Hero Section */}
      <HeroSection />

      {/* Swapy Section */}

      <SectionSwapy />





      {/* Doctors Section */}
      <section id="doctors" className="py-24 px-4 bg-gradient-to-br from-cream to-white">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Medical Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our experienced medical professionals are here to provide you with the best healthcare services.
              All consultations and treatments are provided free of charge to the RUET community.
            </p>
          </motion.div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-medical-primary" />
                  <p className="text-gray-600">Loading doctors...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-red-500 text-xl">⚠️</div>
                  <p className="text-gray-600">
                    Failed to load doctors. Please check if the server is running on localhost:5000
                  </p>
                  <p className="text-sm text-gray-500">
                    Error: {error?.message || 'Unknown error'}
                  </p>
                </div>
              </div>
            )}

            {/* Doctors List */}
            {!isLoading && !isError && doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <DoctorCard
                  doctor={doctor}
                  onBookAppointment={() => handleBookAppointment(doctor.id)}
                />
              </motion.div>
            ))}

            {/* Empty State */}
            {!isLoading && !isError && doctors.length === 0 && (
              <div className="col-span-full flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-gray-400 text-xl">👨‍⚕️</div>
                  <p className="text-gray-600">No doctors available at the moment.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      

      {/* Impact Section */}
      <ImpactSection />

      

      {/* About Section */}
      <AboutSection />



      {/* Services Section */}
      <ServicesSection />

      {/* Facilities Section */}
      <FacilitiesSection />

      {/* Modern Testimonials Section */}
      <ModernTestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Index;
