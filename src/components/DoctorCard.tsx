
/**
 * DoctorCard Component
 * 
 * This component displays individual doctor information in a card format
 * Used in the home page to show the list of available doctors
 * 
 * Features:
 * - Responsive design that works on mobile and desktop
 * - Displays doctor info: name, specialization, experience, rating
 * - Shows available time slots
 * - Interactive "Book Appointment" button
 * - Hover effects for better user experience
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, User } from 'lucide-react';
import { Doctor } from '@/data/doctors';

// Props interface for type safety and better development experience
interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment }) => {
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handle booking button click
   * Navigates to the booking page for the specific doctor
   */
  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment();
    } else {
      navigate(`/book/${doctor.id}`);
    }
  };

  return (
    // Main card container with custom styling and hover effects
    <Card className="w-full max-w-sm mx-auto bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 rounded-2xl overflow-hidden group">
      
      {/* Card Header - Doctor's basic information */}
      <CardHeader className="bg-gradient-to-r from-medical-medium to-medical-dark text-white pb-6 group-hover:from-medical-dark group-hover:to-medical-medium transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Doctor avatar placeholder */}
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            {/* Doctor name */}
            <CardTitle className="text-xl font-bold text-white mb-2">
              {doctor.name}
            </CardTitle>
            
            {/* Specialization badge */}
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white hover:bg-white/30 text-sm font-semibold border-white/30"
            >
              {doctor.specialization}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Card Content - Experience, rating, and available slots */}
      <CardContent className="p-6 space-y-5">
        
        {/* Experience and Rating section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-medical-medium" />
            <span className="text-sm font-semibold">{doctor.experience} experience</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-700">{doctor.rating}</span>
          </div>
        </div>

        {/* Doctor bio/description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {doctor.bio}
        </p>

        {/* Available time slots */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Available Today</h4>
          <div className="flex flex-wrap gap-2">
            {/* Show first 3 available slots */}
            {doctor.availableSlots.slice(0, 3).map((slot, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs px-3 py-1 bg-medical-light border-medical-medium text-medical-dark hover:bg-medical-medium hover:text-white transition-all duration-200 font-medium"
              >
                {slot}
              </Badge>
            ))}
            
            {/* Show "more" indicator if there are additional slots */}
            {doctor.availableSlots.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 bg-gray-50 border-gray-300 text-gray-600 font-medium"
              >
                +{doctor.availableSlots.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      {/* Card Footer - Book appointment button */}
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleBookAppointment}
          className="w-full bg-gradient-to-r from-medical-medium to-medical-dark hover:from-medical-dark hover:to-medical-medium text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
