
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

import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { doctors } from "@/data/doctors";
import { useNavigate } from "react-router-dom";
import DoctorCard from "@/components/DoctorCard";
import NavbarDemo from "@/components/resizable-navbar-demo";
import { motion } from "motion/react";
import HeroSection from "@/components/HeroSection";
import ImpactSection from "@/components/ImpactSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterCTA from "@/components/FooterCTA";
import AboutSection from "@/components/AboutSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import ContactSection from "@/components/ContactSection";

/**
 * Index Component - Main Home Page
 * 
 * Features:
 * - Responsive design with Tailwind CSS
 * - Hero section with gradient background and animations
 * - Doctor cards grid layout
 * - Navigation to individual booking pages
 * - Uses improved medical theme colors
 */
const Index = () => {
  const navigate = useNavigate();

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

      {/* Impact Section */}
      <ImpactSection />

      {/* About Section */}
      <AboutSection />

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
            {doctors.map((doctor, index) => (
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
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Facilities Section */}
      <FacilitiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer CTA Section */}
      <FooterCTA />
    </div>
  );
};

export default Index;
