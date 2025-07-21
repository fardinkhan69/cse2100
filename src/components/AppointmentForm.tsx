
/**
 * AppointmentForm Component
 * 
 * This component handles the appointment booking form functionality
 * Used in the booking page to collect patient information and appointment details
 * 
 * Features:
 * - Form validation using React Hook Form and Zod
 * - Date and time selection
 * - Patient information collection
 * - Appointment status simulation (Pending state)
 * - Responsive design
 * - Success/error feedback to user
 */

import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, User } from 'lucide-react';
import { Doctor } from '@/data/doctors';
import { toast } from '@/hooks/use-toast';
import { AuthContext } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

// Form validation schema using Zod
const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  problemDescription: z.string().min(10, 'Please provide more details about your problem'),
  appointmentDate: z.string().min(1, 'Please select a date'),
  appointmentTime: z.string().min(1, 'Please select a time slot'),
});

// TypeScript type inference from Zod schema
type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Props interface for the component
interface AppointmentFormProps {
  doctor: Doctor;
}

// Enum for appointment status to make code more readable
enum AppointmentStatus {
  IDLE = 'idle',
  SUBMITTING = 'submitting', 
  PENDING = 'pending',
  CONFIRMED = 'confirmed'
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ doctor }) => {
  // Get authenticated user from context
  const { user } = useContext(AuthContext);

  // State to track appointment booking status
  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus>(AppointmentStatus.IDLE);

  const navigate = useNavigate();
  
  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  // Watch form values for conditional rendering
  const selectedDate = watch('appointmentDate');
  const selectedTime = watch('appointmentTime');

  /**
   * Form submission handler
   * Makes API call to book appointment
   */
  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setAppointmentStatus(AppointmentStatus.SUBMITTING);

      // Prepare appointment data for API
      const appointmentData = {
        doctorId: doctor.id,
        patientName: data.patientName,
        userEmail: user?.email || '',
        problemDescription: data.problemDescription,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
      };

      console.log('Booking appointment with data:', appointmentData);

      // Make API call to create appointment
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      const result = await response.json();
      console.log('Appointment booked successfully:', result);

      // Set status to pending (appointment created successfully)
      setAppointmentStatus(AppointmentStatus.PENDING);

      // Show success toast notification
      toast({
        title: "Appointment Booked Successfully! 🎉",
        description: `Your appointment with ${doctor.name} has been confirmed.`,
      });

      // Reset form for next booking
      reset();

    } catch (error) {
      console.error('Booking failed:', error);
      setAppointmentStatus(AppointmentStatus.IDLE);

      // Show error toast
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Generate available dates for the next 7 days
   * In a real app, this would come from the doctor's actual availability
   */
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0], // YYYY-MM-DD format
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  // If appointment is successfully booked, show success state
  if (appointmentStatus === AppointmentStatus.PENDING) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0 rounded-xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Appointment Booked!
            </h3>
            <p className="text-gray-600">
              Your appointment with <span className="font-medium">{doctor.name}</span> has been submitted.
            </p>
          </div>
          
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2">
            Status: Pending Confirmation
          </Badge>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              📧 You will receive a confirmation email shortly with your appointment details.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0 rounded-xl">
      {/* Form Header */}
      <CardHeader className="bg-gradient-to-r from-medical-medium to-medical-dark text-white rounded-t-xl pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">
              Book Appointment
            </CardTitle>
            <p className="text-white/90 text-sm">
              with {doctor.name}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Form Content */}
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Patient Name Input */}
          <div className="space-y-2">
            <Label htmlFor="patientName" className="text-sm font-medium text-gray-700">
              Your Full Name *
            </Label>
            <Input
              id="patientName"
              type="text"
              placeholder="Enter your full name"
              className="w-full"
              {...register('patientName')}
            />
            {errors.patientName && (
              <p className="text-red-500 text-xs">{errors.patientName.message}</p>
            )}
          </div>



          {/* Problem Description */}
          <div className="space-y-2">
            <Label htmlFor="problemDescription" className="text-sm font-medium text-gray-700">
              Describe Your Problem *
            </Label>
            <Textarea
              id="problemDescription"
              placeholder="Please describe your symptoms or reason for visit..."
              className="w-full min-h-[80px] resize-none"
              {...register('problemDescription')}
            />
            {errors.problemDescription && (
              <p className="text-red-500 text-xs">{errors.problemDescription.message}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date *
            </Label>
            <Select onValueChange={(value) => setValue('appointmentDate', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose appointment date" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableDates().map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.appointmentDate && (
              <p className="text-red-500 text-xs">{errors.appointmentDate.message}</p>
            )}
          </div>

          {/* Time Selection - Only show if date is selected */}
          {selectedDate && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time *
              </Label>
              <Select onValueChange={(value) => setValue('appointmentTime', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {doctor.availableSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.appointmentTime && (
                <p className="text-red-500 text-xs">{errors.appointmentTime.message}</p>
              )}
            </div>
          )}

          {/* Appointment Summary - Show when both date and time are selected */}
          {selectedDate && selectedTime && (
            <div className="bg-cream border border-medical-light rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Doctor:</span> {doctor.name}</p>
                <p><span className="font-medium">Specialization:</span> {doctor.specialization}</p>
                <p><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-medium">Time:</span> {selectedTime}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || appointmentStatus === AppointmentStatus.SUBMITTING}
            className="w-full bg-gradient-to-r from-medical-medium to-medical-dark hover:from-medical-dark hover:to-medical-medium text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {appointmentStatus === AppointmentStatus.SUBMITTING ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Booking Appointment...
              </div>
            ) : (
              'Book Appointment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
