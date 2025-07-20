/**
 * Prescription Modal Component
 * 
 * A comprehensive prescription form modal for doctors to create prescriptions
 * Features:
 * - React Hook Form with Zod validation
 * - ShadCN UI components for consistent styling
 * - Dynamic medication list with add/remove functionality
 * - Professional medical form layout
 * - Responsive design for all devices
 */

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Trash2,
  Pill,
  FileText,
  Calendar,
  User,
  Stethoscope,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createPrescription, type Medication, type PrescriptionCreateData } from '@/services/api';
import { type Appointment } from '@/services/api';

// Zod validation schema
const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required').max(200, 'Name too long'),
  dosage: z.string().min(1, 'Dosage is required').max(100, 'Dosage too long'),
  frequency: z.string().min(1, 'Frequency is required').max(100, 'Frequency too long'),
  duration: z.string().min(1, 'Duration is required').max(100, 'Duration too long'),
  instructions: z.string().max(200, 'Instructions too long').optional(),
});

const prescriptionSchema = z.object({
  symptoms: z.string().min(1, 'Symptoms are required').max(1000, 'Symptoms too long'),
  diagnosis: z.string().min(1, 'Diagnosis is required').max(1000, 'Diagnosis too long'),
  medications: z.array(medicationSchema).min(1, 'At least one medication is required'),
  advice: z.string().max(1000, 'Advice too long').optional(),
  followUpDate: z.string().max(50, 'Follow-up date too long').optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  doctorName: string;
  onSuccess?: () => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  appointment,
  doctorName,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      symptoms: '',
      diagnosis: '',
      medications: [
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ],
      advice: '',
      followUpDate: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'medications',
  });

  const addMedication = () => {
    append({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    });
  };

  const removeMedication = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsSubmitting(true);
    
    try {
      const prescriptionData: PrescriptionCreateData = {
        appointmentId: appointment._id,
        patientId: appointment.userEmail,
        doctorId: appointment.doctorId,
        patientName: appointment.patientName,
        doctorName: doctorName,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        medications: data.medications,
        advice: data.advice || '',
        followUpDate: data.followUpDate || '',
      };

      await createPrescription(prescriptionData);

      toast({
        title: "Prescription Created",
        description: `Prescription for ${appointment.patientName} has been created successfully.`,
      });

      form.reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating prescription:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create prescription';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-medical-dark">
            <FileText className="w-6 h-6" />
            Create Prescription
          </DialogTitle>
          <DialogDescription>
            Create a detailed prescription for {appointment.patientName}
          </DialogDescription>
        </DialogHeader>

        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-medical-light/20 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-medical-medium" />
            <div>
              <p className="text-sm font-medium text-gray-700">Patient</p>
              <p className="text-base font-semibold text-gray-900">{appointment.patientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-medical-medium" />
            <div>
              <p className="text-sm font-medium text-gray-700">Doctor</p>
              <p className="text-base font-semibold text-gray-900">{doctorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-medical-medium" />
            <div>
              <p className="text-sm font-medium text-gray-700">Date</p>
              <p className="text-base font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-medical-medium" />
            <div>
              <p className="text-sm font-medium text-gray-700">Problem</p>
              <p className="text-sm text-gray-600 line-clamp-2">{appointment.problemDescription}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Symptoms */}
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">
                    Symptoms *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the patient's symptoms..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diagnosis */}
            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">
                    Diagnosis *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide your medical diagnosis..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Medications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-semibold text-gray-700">
                  Medications *
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMedication}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Medication
                </Button>
              </div>

              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Pill className="w-4 h-4 text-medical-medium" />
                            Medication {index + 1}
                          </CardTitle>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedication(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`medications.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Medicine Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Paracetamol" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`medications.${index}.dosage`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Dosage *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 500mg" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`medications.${index}.frequency`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Frequency *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 3 times daily" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`medications.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">Duration *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 7 days" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`medications.${index}.instructions`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Special Instructions</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Take after meals" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Advice */}
            <FormField
              control={form.control}
              name="advice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">
                    Medical Advice
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional advice for the patient..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Follow-up Date */}
            <FormField
              control={form.control}
              name="followUpDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">
                    Follow-up Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., After 1 week, Next month"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="order-2 sm:order-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-medical-medium hover:bg-medical-dark text-white order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Prescription
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionModal;
