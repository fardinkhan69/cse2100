/**
 * Centralized API Configuration
 * 
 * Single source of truth for the API base URL.
 * All axios instances and API calls should import from here.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ruet-medical-server.vercel.app';
