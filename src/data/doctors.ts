
/**
 * Static doctor data for the appointment booking system
 * This file contains mock data for demonstration and learning purposes
 * In a real application, this would come from a backend API
 */

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots: string[];
  experience: string;
  rating: number;
  image?: string;
  bio: string;
}

// Mock doctor data - This would typically come from a database
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "General Medicine",
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"],
    experience: "8 years",
    rating: 4.8,
    bio: "Experienced general practitioner specializing in preventive care and chronic disease management."
  },
  {
    id: "2", 
    name: "Dr. Michael Chen",
    specialization: "Cardiology",
    availableSlots: ["08:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
    experience: "12 years",
    rating: 4.9,
    bio: "Board-certified cardiologist with expertise in heart disease prevention and treatment."
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Dermatology", 
    availableSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"],
    experience: "6 years",
    rating: 4.7,
    bio: "Dermatologist specializing in skin conditions, cosmetic procedures, and skin cancer screening."
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    availableSlots: ["08:30 AM", "10:00 AM", "01:30 PM", "03:00 PM"],
    experience: "15 years", 
    rating: 4.9,
    bio: "Orthopedic surgeon with expertise in joint replacement and sports medicine."
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialization: "Pediatrics",
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
    experience: "10 years",
    rating: 4.8,
    bio: "Pediatrician dedicated to providing comprehensive healthcare for children and adolescents."
  },
  {
    id: "6",
    name: "Dr. Robert Anderson",
    specialization: "Neurology",
    availableSlots: ["08:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    experience: "18 years",
    rating: 4.9,
    bio: "Neurologist specializing in the diagnosis and treatment of nervous system disorders."
  }
];

/**
 * Utility function to find a doctor by ID
 * Used in the booking page to get specific doctor details
 */
export const getDoctorById = (id: string): Doctor | undefined => {
  return doctors.find(doctor => doctor.id === id);
};

/**
 * Utility function to get available time slots for a specific doctor
 * This would typically check real-time availability from a booking system
 */
export const getAvailableSlots = (doctorId: string): string[] => {
  const doctor = getDoctorById(doctorId);
  return doctor ? doctor.availableSlots : [];
};
