
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

// Real doctor data from the backend API
export const doctors: Doctor[] = [
  {
    id: "68769fec03173cf72bc07bbb",
    name: "Dr. Fardin Khaan",
    specialization: "General Medicine",
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"],
    experience: "8 years",
    rating: 4.8,
    image: "",
    bio: "Experienced general practitioner specializing in preventive care and chronic disease management."
  },
  {
    id: "6876a02603173cf72bc07bbd",
    name: "Dr. Fatema Tuz Zohora",
    specialization: "Gynecology",
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
    experience: "11 years",
    rating: 4.9,
    image: "",
    bio: "Highly experienced gynecologist specializing in women's reproductive health, prenatal care, and hormonal treatments."
  },
  {
    id: "6876a03d03173cf72bc07bbf",
    name: "Dr. Mursalin",
    specialization: "Cardiology",
    availableSlots: ["08:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
    experience: "12 years",
    rating: 4.9,
    image: "",
    bio: "Board-certified cardiologist with expertise in heart disease prevention and treatment."
  },
  {
    id: "6876a04e03173cf72bc07bc1",
    name: "Dr. Annonoy",
    specialization: "Dermatology",
    availableSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"],
    experience: "6 years",
    rating: 4.7,
    image: "",
    bio: "Dermatologist specializing in skin conditions, cosmetic procedures, and skin cancer screening."
  },
  {
    id: "6876a06503173cf72bc07bc3",
    name: "Dr. Mirza Wajih",
    specialization: "Orthopedics",
    availableSlots: ["08:30 AM", "10:00 AM", "01:30 PM", "03:00 PM"],
    experience: "15 years",
    rating: 4.9,
    image: "",
    bio: "Orthopedic surgeon with expertise in joint replacement and sports medicine."
  },
  {
    id: "6876a07b03173cf72bc07bc5",
    name: "Dr.Toha",
    specialization: "Pediatrics",
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
    experience: "10 years",
    rating: 4.8,
    image: "",
    bio: "Pediatrician dedicated to providing comprehensive healthcare for children and adolescents."
  },
  {
    id: "6876a08903173cf72bc07bc7",
    name: "Dr. Rubayet Islam",
    specialization: "Neurology",
    availableSlots: ["08:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    experience: "18 years",
    rating: 4.9,
    image: "",
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
