
/**
 * Main App Component - Doctor Appointment Booking System
 * 
 * This is the root component that sets up routing and global providers
 * 
 * Routes:
 * - / : Home page with doctor listings
 * - /login : Student login page
 * - /dashboard : Student dashboard
 * - /book/:doctorId : Appointment booking page for specific doctor
 * - * : 404 Not Found page for invalid routes
 * 
 * Global Providers:
 * - QueryClient: For data fetching and caching (React Query)
 * - TooltipProvider: For UI tooltips
 * - Toaster & Sonner: For toast notifications
 * - BrowserRouter: For client-side routing
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorDashboardDemo from "./pages/DoctorDashboardDemo";
import DoctorRegistration from "./pages/DoctorRegistration";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";
import AuthProvider from "./components/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import DoctorRoute from "./components/DoctorRoute";
import AuthDebugger from "./components/AuthDebugger";

// Create a new QueryClient instance for React Query
// This handles caching, background updates, and error retries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes when not in use (renamed from cacheTime)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  // QueryClientProvider: Provides React Query functionality to all child components
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider: Enables tooltip functionality throughout the app */}
    <TooltipProvider>

      {/* Toast notification systems for user feedback */}
      <Toaster />
      <Sonner />

      {/* BrowserRouter: Enables client-side routing */}
      <BrowserRouter>
        {/* AuthProvider: Provides authentication context to all routes */}
        <AuthProvider>
          <AuthDebugger />
          <Routes>
            {/* Home page route - displays all doctors */}
            <Route path="/" element={<Index />} />

            {/* Login page route - student authentication */}
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard route - student appointment management */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            {/* Doctor Dashboard route - doctor appointment management */}
            <Route path="/doctor-dashboard" element={<PrivateRoute>

              <DoctorRoute>
                <DoctorDashboard />
              </DoctorRoute>

            </PrivateRoute>} />



            {/* Doctor Registration route - public registration form */}
            <Route path="/doctor-registration" element={<PrivateRoute>
              <DoctorRegistration />
            </PrivateRoute>} />



            {/* Protected Individual doctor booking page - uses dynamic parameter */}
            <Route path="/book/:doctorId" element={
              <PrivateRoute>
                <BookAppointment />
              </PrivateRoute>
            } />

            {/* Catch-all route for 404 errors - MUST be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
