/**
 * Doctor API Service
 * 
 * API functions for doctor dashboard functionality
 * This file provides the API integration layer for the doctor dashboard
 * Replace the dummy data in DoctorDashboard.tsx with these API calls
 */

import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://ruet-medical-server.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces
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

export interface DoctorProfile {
  _id: string;
  name: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  bio: string;
  qualifications: string;
  address: string;
  availableSlots: string[];
  rating: number;
  image: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Get all appointments for a specific doctor
 * @param doctorId - The ID of the doctor
 * @returns Promise<Appointment[]> - Array of appointments
 */
export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments', {
      params: { doctorId }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch appointments');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
};

/**
 * Approve an appointment (set booking to true)
 * @param appointmentId - The ID of the appointment to approve
 * @returns Promise<Appointment> - Updated appointment object
 */
export const approveAppointment = async (appointmentId: string): Promise<Appointment> => {
  try {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}`, {
      booking: true
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to approve appointment');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error approving appointment:', error);
    throw error;
  }
};

/**
 * Get doctor profile by ID
 * @param doctorId - The ID of the doctor
 * @returns Promise<DoctorProfile> - Doctor profile object
 */
export const getDoctorProfile = async (doctorId: string): Promise<DoctorProfile> => {
  try {
    const response = await api.get<ApiResponse<DoctorProfile>>(`/doctors/${doctorId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch doctor profile');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

/**
 * Update doctor profile
 * @param doctorId - The ID of the doctor
 * @param profileData - Updated profile data
 * @returns Promise<DoctorProfile> - Updated doctor profile object
 */
export const updateDoctorProfile = async (
  doctorId: string, 
  profileData: Partial<DoctorProfile>
): Promise<DoctorProfile> => {
  try {
    const response = await api.put<ApiResponse<DoctorProfile>>(`/doctors/${doctorId}`, profileData);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update doctor profile');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

/**
 * Delete an appointment
 * @param appointmentId - The ID of the appointment to delete
 * @returns Promise<void>
 */
export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const response = await api.delete<ApiResponse<any>>(`/appointments/${appointmentId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete appointment');
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

/**
 * Get appointment statistics for a doctor
 * @param doctorId - The ID of the doctor
 * @returns Promise<object> - Statistics object
 */
export const getDoctorStats = async (doctorId: string): Promise<{
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
}> => {
  try {
    const appointments = await getDoctorAppointments(doctorId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(apt => !apt.booking).length,
      completedAppointments: appointments.filter(apt => apt.booking).length,
      todayAppointments: appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      }).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error calculating doctor stats:', error);
    throw error;
  }
};

// Export the axios instance for custom requests
export { api };

/**
 * Example usage in DoctorDashboard component:
 * 
 * import { getDoctorAppointments, approveAppointment, getDoctorProfile, updateDoctorProfile } from '@/services/doctorApi';
 * 
 * // In useEffect:
 * useEffect(() => {
 *   const fetchData = async () => {
 *     try {
 *       const appointments = await getDoctorAppointments(doctorId);
 *       setAppointments(appointments);
 *       
 *       const profile = await getDoctorProfile(doctorId);
 *       setDoctorProfile(profile);
 *     } catch (error) {
 *       console.error('Error fetching data:', error);
 *     }
 *   };
 *   
 *   fetchData();
 * }, [doctorId]);
 * 
 * // In approval handler:
 * const handleApproveAppointment = async (appointmentId: string) => {
 *   try {
 *     setIsLoading(true);
 *     const updatedAppointment = await approveAppointment(appointmentId);
 *     
 *     setAppointments(prev => 
 *       prev.map(apt => 
 *         apt._id === appointmentId ? updatedAppointment : apt
 *       )
 *     );
 *     
 *     toast({ title: "Success", description: "Appointment approved!" });
 *   } catch (error) {
 *     toast({ title: "Error", description: "Failed to approve appointment", variant: "destructive" });
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 */
