/**
 * Doctor Registration Component
 * 
 * Matches the exact database schema structure for doctor registration
 * Uses React Hook Form for form management and validation
 * Outputs data ready for Express.js backend insertion
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Stethoscope, 
  Clock,
  Star,
  Image,
  FileText,
  ArrowLeft,
  Save,
  Plus,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '@/hooks/use-toast';
import { createDoctor, DoctorRegistrationData } from '@/services/api';

// Validation schema matching database structure
const doctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  availableSlots: z.array(z.string()).min(1, 'At least one time slot is required'),
  experience: z.string().regex(/^\d+\s+years?$/i, 'Experience must be in format "X years" (e.g., "15 years")'),
  rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').optional(),
  image: z.string().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be at most 500 characters'),
});

// TypeScript type inference from Zod schema
type DoctorFormData = z.infer<typeof doctorSchema>;

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    trigger
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: '',
      email: '',
      specialization: '',
      availableSlots: [],
      experience: '',
      rating: 5.0,
      image: '',
      bio: '',
    }
  });

  // Predefined time slots for selection
  const predefinedTimeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
  ];

  const specializations = [
    "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology",
    "Psychiatry", "General Medicine", "Surgery", "Gynecology", "Ophthalmology",
    "ENT", "Radiology", "Pathology", "Anesthesiology", "Emergency Medicine",
    "Heart Specialist", "Diabetes Specialist", "Kidney Specialist"
  ];

  // Add time slot to available slots
  const addTimeSlot = (timeSlot: string) => {
    const currentSlots = watch('availableSlots') || [];
    if (!currentSlots.includes(timeSlot)) {
      const newSlots = [...currentSlots, timeSlot].sort();
      setValue('availableSlots', newSlots);
    }
  };

  // Remove time slot from available slots
  const removeTimeSlot = (timeSlot: string) => {
    const currentSlots = watch('availableSlots') || [];
    const newSlots = currentSlots.filter(slot => slot !== timeSlot);
    setValue('availableSlots', newSlots);
  };

  // Add custom time slot
  const addCustomTimeSlot = () => {
    if (newTimeSlot.trim() && !watch('availableSlots')?.includes(newTimeSlot.trim())) {
      addTimeSlot(newTimeSlot.trim());
      setNewTimeSlot('');
    }
  };

  // Step navigation functions
  const nextStep = async () => {
    let fieldsToValidate: (keyof DoctorFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'email', 'specialization', 'experience'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['availableSlots'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(3, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Form submission handler
  const onSubmit = async (data: DoctorFormData) => {
    setIsLoading(true);

    try {
      // Prepare data for backend (matching database schema)
      const doctorData: DoctorRegistrationData = {
        name: data.name,
        email: data.email,
        specialization: data.specialization,
        availableSlots: data.availableSlots,
        experience: data.experience,
        rating: data.rating || 5.0,
        image: data.image || '',
        bio: data.bio,
      };

      // Log the data being sent to backend
      console.log('Sending Doctor Registration Data:', doctorData);

      // Make actual API call to create doctor
      const createdDoctor = await createDoctor(doctorData);

      console.log('Doctor Created Successfully:', createdDoctor);

      toast({
        title: "Registration Successful! 🎉",
        description: `Dr. ${createdDoctor.name} has been registered successfully as a ${createdDoctor.specialization} specialist.`,
      });

      // Reset form after successful submission
      reset();
      setCurrentStep(1);

      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate('/doctor-dashboard');
      }, 2000);

    } catch (error) {
      console.error('Doctor Registration Error:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'There was an error submitting your registration. Please try again.';

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Basic Information
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="w-5 h-5 text-medical-medium" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
              Full Name *
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Dr. John Doe"
              className="h-12 text-base"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="doctor@example.com"
              className="h-12 text-base"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <Label htmlFor="specialization" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Specialization *
            </Label>
            <Controller
              name="specialization"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec} className="text-base">{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 mb-2 block">
              Years of Experience *
            </Label>
            <Input
              id="experience"
              {...register('experience')}
              placeholder="15 years"
              className="h-12 text-base"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Format: "X years" (e.g., "15 years")</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Step 2: Schedule & Availability
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Clock className="w-5 h-5 text-medical-medium" />
            Available Time Slots *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          {/* Current Selected Slots */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Selected Time Slots ({watch('availableSlots')?.length || 0})
            </Label>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[48px] p-3 border rounded-lg bg-gray-50">
              {watch('availableSlots')?.length ? (
                watch('availableSlots')?.map((slot) => (
                  <Badge
                    key={slot}
                    variant="secondary"
                    className="bg-medical-medium text-white hover:bg-medical-dark cursor-pointer h-8 px-3 text-sm flex items-center gap-1"
                    onClick={() => removeTimeSlot(slot)}
                  >
                    {slot}
                    <X className="w-3 h-3" />
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No time slots selected</p>
              )}
            </div>
            {errors.availableSlots && (
              <p className="text-red-500 text-sm">{errors.availableSlots.message}</p>
            )}
          </div>

          {/* Predefined Time Slots */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Select from Available Times
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {predefinedTimeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={watch('availableSlots')?.includes(slot) ? "default" : "outline"}
                  size="sm"
                  onClick={() => addTimeSlot(slot)}
                  disabled={watch('availableSlots')?.includes(slot)}
                  className="h-11 text-xs md:text-sm px-2"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Time Slot */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Add Custom Time Slot
            </Label>
            <div className="flex gap-2">
              <Input
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                placeholder="e.g., 08:00 AM"
                className="h-12 text-base flex-1"
              />
              <Button
                type="button"
                onClick={addCustomTimeSlot}
                disabled={!newTimeSlot.trim()}
                className="h-12 w-12 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: "HH:MM AM/PM" (e.g., "08:00 AM")</p>
          </div>

          {/* Rating */}
          <div>
            <Label htmlFor="rating" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Initial Rating (Optional)
            </Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="5.0"
                  className="h-12 text-base"
                />
              )}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Rating between 0-5 (defaults to 5.0)</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Step 3: Profile & Bio
  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-6"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="w-5 h-5 text-medical-medium" />
            Profile & Bio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          {/* Image URL */}
          <div>
            <Label htmlFor="image" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Profile Image URL (Optional)
            </Label>
            <Input
              id="image"
              {...register('image')}
              placeholder="https://example.com/doctor-photo.jpg"
              className="h-12 text-base"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Leave empty if no image available</p>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-sm font-semibold text-gray-700 mb-2 block">
              Professional Bio *
            </Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Experienced general practitioner specializing in preventive care and chronic disease management..."
              className="min-h-[120px] md:min-h-[140px] resize-none text-base"
              rows={5}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Describe your expertise, experience, and approach to healthcare (10-500 characters)
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-medical-light/20">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 h-11 px-4 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Doctor Registration</h1>
          <p className="text-base md:text-lg text-gray-600">Join RUET Medical Center</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          {/* Mobile Progress (Vertical Stack) */}
          <div className="block md:hidden">
            <div className="flex flex-col space-y-4 max-w-sm mx-auto">
              {[
                { number: 1, title: "Basic Information", short: "Basic" },
                { number: 2, title: "Schedule & Availability", short: "Schedule" },
                { number: 3, title: "Profile & Bio", short: "Profile" }
              ].map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 flex-shrink-0 ${
                    currentStep >= step.number
                      ? 'bg-medical-medium border-medical-medium text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-4 flex-1">
                    <span className={`text-base font-medium block ${
                      currentStep >= step.number ? 'text-medical-medium' : 'text-gray-400'
                    }`}>
                      {step.short}
                    </span>
                    <span className={`text-xs block ${
                      currentStep >= step.number ? 'text-medical-medium/70' : 'text-gray-400'
                    }`}>
                      Step {step.number} of 3
                    </span>
                  </div>
                  {currentStep === step.number && (
                    <div className="w-3 h-3 bg-medical-medium rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Progress (Horizontal) */}
          <div className="hidden md:flex items-center justify-center space-x-4">
            {[
              { number: 1, title: "Basic Info" },
              { number: 2, title: "Schedule" },
              { number: 3, title: "Profile & Bio" }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-medical-medium border-medical-medium text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-medical-medium' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-medical-medium' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Current Step Content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 md:mt-8 px-4 md:px-0">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center gap-2 h-12 text-base order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-medical-medium hover:bg-medical-dark text-white flex items-center justify-center gap-2 h-12 text-base order-1 sm:order-2"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 h-12 text-base order-1 sm:order-2"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Registering...</span>
                      <span className="sm:hidden">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">Complete Registration</span>
                      <span className="sm:hidden">Complete</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorRegistration;
