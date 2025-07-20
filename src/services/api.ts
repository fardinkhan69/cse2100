/**
 * API Service for Doctor Appointment System
 * 
 * This file contains all API-related functions for fetching data from the backend
 * Base URL: https://ruet-medical-server.vercel.app
 */

import axios from 'axios';
import { Doctor } from '@/data/doctors';

// Base API URL - in production this would come from environment variables
const API_BASE_URL = 'https://ruet-medical-server.vercel.app';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Response interface for doctors data
 */
interface DoctorApiResponse {
  success: boolean;
  data: Array<{
    _id: string;
    name: string;
    specialization: string;
    availableSlots: string[];
    experience: string;
    rating: number;
    image: string;
    bio: string;
    email?: string;
    createdAt: string;
    __v: number;
  }>;
}

/**
 * Single Doctor API Response interface
 */
interface SingleDoctorApiResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    specialization: string;
    availableSlots: string[];
    experience: string;
    rating: number;
    image: string;
    bio: string;
    email?: string;
    createdAt: string;
    __v: number;
  };
}

/**
 * Doctor Registration Data interface
 */
export interface DoctorRegistrationData {
  name: string;
  email: string;
  specialization: string;
  availableSlots: string[];
  experience: string;
  rating?: number;
  image?: string;
  bio: string;
}

/**
 * Appointment interface
 */
export interface Appointment {
  _id: string;
  doctorId: string;
  patientName: string;
  userEmail: string;
  problemDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  booking: boolean;
  createdAt: string;
}

/**
 * Appointment API Response interface
 */
interface AppointmentApiResponse {
  success: boolean;
  data: Appointment[];
}

/**
 * Prescription interface
 */
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  _id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  medications: Medication[];
  advice?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Prescription API Response interfaces
 */
interface PrescriptionApiResponse {
  success: boolean;
  data: Prescription[];
}

interface SinglePrescriptionApiResponse {
  success: boolean;
  data: Prescription;
}

/**
 * Prescription creation data interface
 */
export interface PrescriptionCreateData {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  symptoms: string;
  diagnosis: string;
  medications: Medication[];
  advice?: string;
  followUpDate?: string;
}

/**
 * API Error Response interface
 */
interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

/**
 * Transform API doctor data to match our Doctor interface
 */
const transformDoctorData = (apiDoctor: DoctorApiResponse['data'][0]): Doctor => ({
  _id: apiDoctor._id,
  id: apiDoctor._id, // Map _id to id for backward compatibility
  name: apiDoctor.name,
  specialization: apiDoctor.specialization,
  availableSlots: apiDoctor.availableSlots,
  experience: apiDoctor.experience,
  rating: apiDoctor.rating,
  image: apiDoctor.image,
  bio: apiDoctor.bio,
  email: (apiDoctor as any).email, // Email field might not be in all responses
  createdAt: apiDoctor.createdAt,
  __v: apiDoctor.__v,
});

/**
 * Fetch all doctors from the API
 * @returns Promise<Doctor[]> - Array of doctors
 */
export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await api.get<DoctorApiResponse>('/doctors');
    
    if (!response.data.success) {
      throw new Error('Failed to fetch doctors');
    }
    
    return response.data.data.map(transformDoctorData);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

/**
 * Fetch a single doctor by ID from the API
 * @param doctorId - The ID of the doctor to fetch
 * @returns Promise<Doctor | null> - Doctor object or null if not found
 */
export const fetchDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const response = await api.get<SingleDoctorApiResponse>(`/doctors/${doctorId}`);
    
    if (!response.data.success) {
      return null;
    }
    
    return transformDoctorData(response.data.data);
  } catch (error) {
    console.error('Error fetching doctor by ID:', error);
    // If it's a 404 error, return null instead of throwing
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Create a new doctor registration
 * @param doctorData - The doctor registration data
 * @returns Promise<Doctor> - The created doctor object
 */
export const createDoctor = async (doctorData: DoctorRegistrationData): Promise<Doctor> => {
  try {
    const response = await api.post<SingleDoctorApiResponse>('/doctors', doctorData);

    if (!response.data.success) {
      throw new Error('Failed to create doctor');
    }

    return transformDoctorData(response.data.data);
  } catch (error) {
    console.error('Error creating doctor:', error);

    // Handle axios errors with better error messages
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;

      if (errorData?.message) {
        throw new Error(errorData.message);
      }

      if (error.response?.status === 400) {
        throw new Error('Invalid doctor registration data. Please check all required fields.');
      }

      if (error.response?.status === 409) {
        throw new Error('A doctor with this name and specialization already exists.');
      }

      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }

    throw error;
  }
};

/**
 * Fetch a doctor by email address
 * @param email - The email address of the doctor
 * @returns Promise<Doctor | null> - Doctor object or null if not found
 */
export const fetchDoctorByEmail = async (email: string): Promise<Doctor | null> => {
  try {
    const allDoctors = await fetchDoctors();
    const doctor = allDoctors.find(doc => doc.email?.toLowerCase() === email.toLowerCase());
    return doctor || null;
  } catch (error) {
    console.error('Error fetching doctor by email:', error);
    throw error;
  }
};

/**
 * Get available time slots for a specific doctor
 * @param doctorId - The ID of the doctor
 * @returns Promise<string[]> - Array of available time slots
 */
export const fetchDoctorAvailableSlots = async (doctorId: string): Promise<string[]> => {
  try {
    const doctor = await fetchDoctorById(doctorId);
    return doctor ? doctor.availableSlots : [];
  } catch (error) {
    console.error('Error fetching doctor available slots:', error);
    return [];
  }
};

/**
 * Fetch all appointments from the API
 * @returns Promise<Appointment[]> - Array of appointments
 */
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get<AppointmentApiResponse>('/appointments');

    if (!response.data.success) {
      throw new Error('Failed to fetch appointments');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Fetch appointments by doctor ID
 * @param doctorId - The ID of the doctor
 * @returns Promise<Appointment[]> - Array of appointments for the doctor
 */
export const fetchAppointmentsByDoctorId = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const allAppointments = await fetchAppointments();
    return allAppointments.filter(appointment => appointment.doctorId === doctorId);
  } catch (error) {
    console.error('Error fetching appointments by doctor ID:', error);
    throw error;
  }
};

/**
 * Update appointment booking status (approve/reject)
 * @param appointmentId - The ID of the appointment
 * @param bookingStatus - The new booking status
 * @returns Promise<Appointment> - The updated appointment
 */
export const updateAppointmentBooking = async (appointmentId: string, bookingStatus: boolean): Promise<Appointment> => {
  try {
    const response = await api.put<{ success: boolean; data: Appointment }>(`/appointments/${appointmentId}`, {
      booking: bookingStatus
    });

    if (!response.data.success) {
      throw new Error('Failed to update appointment');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error updating appointment:', error);

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;

      if (errorData?.message) {
        throw new Error(errorData.message);
      }

      if (error.response?.status === 404) {
        throw new Error('Appointment not found.');
      }

      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }

    throw error;
  }
};

/**
 * Create a new prescription
 * @param prescriptionData - The prescription data
 * @returns Promise<Prescription> - The created prescription
 */
export const createPrescription = async (prescriptionData: PrescriptionCreateData): Promise<Prescription> => {
  try {
    const response = await api.post<SinglePrescriptionApiResponse>('/prescriptions', prescriptionData);

    if (!response.data.success) {
      throw new Error('Failed to create prescription');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error creating prescription:', error);

    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiErrorResponse;

      if (errorData?.message) {
        throw new Error(errorData.message);
      }

      if (error.response?.status === 400) {
        throw new Error('Invalid prescription data. Please check all required fields.');
      }

      if (error.response?.status === 409) {
        throw new Error('Prescription already exists for this appointment.');
      }

      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }

    throw error;
  }
};

/**
 * Fetch prescriptions by patient ID
 * @param patientId - The patient ID (email)
 * @returns Promise<Prescription[]> - Array of prescriptions
 */
export const fetchPrescriptionsByPatient = async (patientId: string): Promise<Prescription[]> => {
  try {
    const response = await api.get<PrescriptionApiResponse>(`/prescriptions/patient/${patientId}`);

    if (!response.data.success) {
      throw new Error('Failed to fetch prescriptions');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching prescriptions by patient:', error);
    throw error;
  }
};

/**
 * Fetch prescriptions by doctor ID
 * @param doctorId - The doctor ID
 * @returns Promise<Prescription[]> - Array of prescriptions
 */
export const fetchPrescriptionsByDoctor = async (doctorId: string): Promise<Prescription[]> => {
  try {
    const response = await api.get<PrescriptionApiResponse>(`/prescriptions/doctor/${doctorId}`);

    if (!response.data.success) {
      throw new Error('Failed to fetch prescriptions');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching prescriptions by doctor:', error);
    throw error;
  }
};

/**
 * Fetch single prescription by ID
 * @param prescriptionId - The prescription ID
 * @returns Promise<Prescription> - The prescription
 */
export const fetchPrescriptionById = async (prescriptionId: string): Promise<Prescription> => {
  try {
    const response = await api.get<SinglePrescriptionApiResponse>(`/prescriptions/${prescriptionId}`);

    if (!response.data.success) {
      throw new Error('Failed to fetch prescription');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error fetching prescription by ID:', error);
    throw error;
  }
};

// Export the axios instance for other API calls if needed
export { api };
