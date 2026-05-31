
/**
 * Main App Component - Doctor Appointment Booking System
 * 
 * This is the root component that sets up routing and global providers
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
import DoctorRegistration from "./pages/DoctorRegistration";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";
import AuthProvider from "./components/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import DoctorRoute from "./components/DoctorRoute";

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Home page route */}
            <Route path="/" element={<Index />} />

            {/* Login page route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard route - student appointment management */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            {/* Doctor Dashboard route - doctor appointment management */}
            <Route path="/doctor-dashboard" element={
              <PrivateRoute>
                <DoctorRoute>
                  <DoctorDashboard />
                </DoctorRoute>
              </PrivateRoute>
            } />

            {/* Doctor Registration route - Admin only */}
            <Route path="/doctor-registration" element={
              <AdminRoute>
                <DoctorRegistration />
              </AdminRoute>
            } />

            {/* Protected Individual doctor booking page */}
            <Route path="/book/:doctorId" element={
              <PrivateRoute>
                <BookAppointment />
              </PrivateRoute>
            } />

            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
