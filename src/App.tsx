
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
import AuthDebugger from "./components/AuthDebugger";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PatientList from "./pages/admin/PatientList";
import PatientDetail from "./pages/admin/PatientDetail";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import BillingPage from "./pages/admin/BillingPage";
import CreateInvoice from "./pages/admin/CreateInvoice";
import StaffPage from "./pages/admin/StaffPage";
import SettingsPage from "./pages/admin/SettingsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import PharmacyPage from "./pages/admin/PharmacyPage";

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
          <ThemeProvider>
            <NotificationProvider>
              <AuthDebugger />
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

            {/* Admin/Clinic OS Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/patients" element={
              <AdminRoute>
                <PatientList />
              </AdminRoute>
            } />
            <Route path="/admin/patients/:patientId" element={
              <AdminRoute>
                <PatientDetail />
              </AdminRoute>
            } />
            <Route path="/admin/appointments" element={
              <AdminRoute>
                <AppointmentsPage />
              </AdminRoute>
            } />
            <Route path="/admin/billing" element={
              <AdminRoute>
                <BillingPage />
              </AdminRoute>
            } />
            <Route path="/admin/billing/create" element={
              <AdminRoute>
                <CreateInvoice />
              </AdminRoute>
            } />
            <Route path="/admin/staff" element={
              <AdminRoute>
                <StaffPage />
              </AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute>
                <AnalyticsPage />
              </AdminRoute>
            } />
            <Route path="/admin/pharmacy" element={
              <AdminRoute>
                <PharmacyPage />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            } />
            <Route path="/admin/notifications" element={
              <AdminRoute>
                <NotificationsPage />
              </AdminRoute>
            } />

            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
