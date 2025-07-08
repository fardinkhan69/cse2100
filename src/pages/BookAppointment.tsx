
/**
 * BookAppointment Page Component
 * 
 * This page handles the appointment booking functionality for a specific doctor
 * Accessed via route: /book/:doctorId
 * 
 * Features:
 * - Fetches doctor information based on URL parameter
 * - Displays doctor details in a summary card
 * - Renders appointment booking form
 * - Handles case when doctor is not found (404 scenario)
 * - Responsive design for all screen sizes
 * - Navigation back to home page
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppointmentForm from '@/components/AppointmentForm';
import { getDoctorById } from '@/data/doctors';
import { ArrowLeft, Star, Clock, User, Stethoscope } from 'lucide-react';

const BookAppointment = () => {
  // Get doctor ID from URL parameters
  const { doctorId } = useParams<{ doctorId: string }>();
  
  // Navigation hook for going back to home page
  const navigate = useNavigate();
  
  // Find the specific doctor based on the ID from URL
  const doctor = doctorId ? getDoctorById(doctorId) : null;

  /**
   * Navigate back to home page
   */
  const handleGoBack = () => {
    navigate('/');
  };

  /**
   * Handle case when doctor is not found
   * This could happen if user enters invalid doctor ID in URL
   */
  if (!doctor) {
    return (
      <div className="min-h-screen bg-cream font-poppins flex items-center justify-center px-4">
        <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0 rounded-xl text-center">
          <CardContent className="p-8 space-y-6">
            
            {/* Error icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Stethoscope className="w-8 h-8 text-red-600" />
            </div>
            
            {/* Error message */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Doctor Not Found
              </h2>
              <p className="text-gray-600">
                Sorry, we couldn't find the doctor you're looking for. 
                The doctor may not be available or the link might be incorrect.
              </p>
            </div>
            
            {/* Back to home button */}
            <Button 
              onClick={handleGoBack}
              className="w-full bg-gradient-to-r from-medical-medium to-medical-dark hover:from-medical-dark hover:to-medical-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Doctors
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-poppins py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Page header with back navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 text-medical-dark hover:text-medical-medium hover:bg-white/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Button>
        
        {/* Page title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Book Your 
            <span className="bg-gradient-to-r from-medical-medium to-medical-dark bg-clip-text text-transparent ml-2">
              Appointment
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Schedule your visit with our medical expert
          </p>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Doctor Information Card */}
        <div className="lg:order-1">
          <Card className="bg-white shadow-xl border-0 rounded-xl h-fit sticky top-8">
            
            {/* Doctor card header */}
            <CardHeader className="bg-gradient-to-r from-medical-light to-medical-medium text-white rounded-t-xl pb-6">
              <div className="flex items-center gap-4">
                {/* Doctor avatar */}
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-semibold text-white mb-2">
                    {doctor.name}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white hover:bg-white/30 font-medium"
                  >
                    {doctor.specialization}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            {/* Doctor details */}
            <CardContent className="p-6 space-y-6">
              
              {/* Experience and Rating */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{doctor.experience} experience</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">{doctor.rating}</span>
                  <span className="text-gray-500 text-sm">/5.0</span>
                </div>
              </div>

              {/* Doctor bio */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {doctor.bio}
                </p>
              </div>

              {/* Available time slots */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Available Time Slots</h3>
                <div className="grid grid-cols-2 gap-2">
                  {doctor.availableSlots.map((slot, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="justify-center py-2 bg-cream border-medical-medium text-medical-dark hover:bg-medical-light hover:text-white transition-colors"
                    >
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  💡 Booking Information
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Appointments are confirmed within 2 hours</li>
                  <li>• Please arrive 15 minutes early</li>
                  <li>• Bring your insurance card and ID</li>
                  <li>• Cancellations allowed up to 24 hours prior</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Booking Form */}
        <div className="lg:order-2">
          <AppointmentForm doctor={doctor} />
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-8"></div>
    </div>
  );
};

export default BookAppointment;
