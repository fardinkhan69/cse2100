/**
 * API Service for Doctor Appointment System
 * 
 * This file contains all API-related functions for fetching data from the backend
 * Base URL: http://localhost:5000
 */

import axios from 'axios';
import { Doctor } from '@/data/doctors';

// Base API URL - in production this would come from environment variables
const API_BASE_URL = 'http://localhost:5000';

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
    createdAt: string;
    __v: number;
  };
}

/**
 * Doctor Registration Data interface
 */
export interface DoctorRegistrationData {
  name: string;
  specialization: string;
  availableSlots: string[];
  experience: string;
  rating?: number;
  image?: string;
  bio: string;
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
  id: apiDoctor._id,
  name: apiDoctor.name,
  specialization: apiDoctor.specialization,
  availableSlots: apiDoctor.availableSlots,
  experience: apiDoctor.experience,
  rating: apiDoctor.rating,
  image: apiDoctor.image,
  bio: apiDoctor.bio,
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

// Export the axios instance for other API calls if needed
export { api };
