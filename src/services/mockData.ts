// Mock Data Service for Clinic OS
// Provides typed interfaces and sample data for all admin pages

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  lastVisit: string;
  totalVisits: number;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  notes: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
  dueDate: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'doctor' | 'nurse' | 'receptionist' | 'admin';
  specialization: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar: string;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'billing' | 'system' | 'patient';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityFeed {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: string;
}

export interface DashboardStats {
  totalPatients: { value: number; percentChange: number };
  appointmentsToday: { value: number; percentChange: number };
  monthlyRevenue: { value: number; percentChange: number };
  activeDoctors: { value: number; percentChange: number };
}

export interface WorkingHour {
  day: string;
  start: string;
  end: string;
  isOff: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
}

export interface ClinicService {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface ClinicSettings {
  general: { name: string; address: string; phone: string; email: string };
  workingHours: WorkingHour[];
  holidays: Holiday[];
  services: ClinicService[];
}

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567', dateOfBirth: '1985-03-15', bloodGroup: 'A+', gender: 'female', address: '123 Oak Street, Springfield', lastVisit: '2024-01-15', totalVisits: 12, status: 'active' },
  { id: 'p2', name: 'Michael Chen', email: 'mchen@email.com', phone: '(555) 234-5678', dateOfBirth: '1978-07-22', bloodGroup: 'O-', gender: 'male', address: '456 Elm Ave, Portland', lastVisit: '2024-01-12', totalVisits: 8, status: 'active' },
  { id: 'p3', name: 'Emily Rodriguez', email: 'emily.r@email.com', phone: '(555) 345-6789', dateOfBirth: '1992-11-30', bloodGroup: 'B+', gender: 'female', address: '789 Pine Road, Austin', lastVisit: '2024-01-10', totalVisits: 5, status: 'active' },
  { id: 'p4', name: 'James Wilson', email: 'jwilson@email.com', phone: '(555) 456-7890', dateOfBirth: '1970-05-08', bloodGroup: 'AB+', gender: 'male', address: '321 Maple Lane, Denver', lastVisit: '2023-12-20', totalVisits: 15, status: 'active' },
  { id: 'p5', name: 'Olivia Martinez', email: 'olivia.m@email.com', phone: '(555) 567-8901', dateOfBirth: '1988-09-14', bloodGroup: 'A-', gender: 'female', address: '654 Cedar Court, Miami', lastVisit: '2024-01-08', totalVisits: 3, status: 'active' },
  { id: 'p6', name: 'David Kim', email: 'dkim@email.com', phone: '(555) 678-9012', dateOfBirth: '1995-01-25', bloodGroup: 'O+', gender: 'male', address: '987 Birch Street, Seattle', lastVisit: '2023-11-15', totalVisits: 7, status: 'inactive' },
  { id: 'p7', name: 'Sophia Brown', email: 'sophia.b@email.com', phone: '(555) 789-0123', dateOfBirth: '1983-06-18', bloodGroup: 'B-', gender: 'female', address: '147 Walnut Ave, Chicago', lastVisit: '2024-01-14', totalVisits: 10, status: 'active' },
  { id: 'p8', name: 'Robert Taylor', email: 'rtaylor@email.com', phone: '(555) 890-1234', dateOfBirth: '1965-12-03', bloodGroup: 'AB-', gender: 'male', address: '258 Ash Boulevard, Boston', lastVisit: '2024-01-05', totalVisits: 20, status: 'active' },
  { id: 'p9', name: 'Isabella Garcia', email: 'igarcia@email.com', phone: '(555) 901-2345', dateOfBirth: '1990-04-27', bloodGroup: 'A+', gender: 'female', address: '369 Spruce Drive, Phoenix', lastVisit: '2024-01-11', totalVisits: 6, status: 'active' },
  { id: 'p10', name: 'William Lee', email: 'wlee@email.com', phone: '(555) 012-3456', dateOfBirth: '1975-08-09', bloodGroup: 'O+', gender: 'male', address: '741 Cypress Lane, San Diego', lastVisit: '2023-10-30', totalVisits: 4, status: 'inactive' },
  { id: 'p11', name: 'Ava Thompson', email: 'ava.t@email.com', phone: '(555) 111-2222', dateOfBirth: '1998-02-14', bloodGroup: 'B+', gender: 'female', address: '852 Poplar Street, Dallas', lastVisit: '2024-01-13', totalVisits: 2, status: 'active' },
  { id: 'p12', name: 'Daniel White', email: 'dwhite@email.com', phone: '(555) 333-4444', dateOfBirth: '1982-10-21', bloodGroup: 'A-', gender: 'male', address: '963 Hickory Way, Atlanta', lastVisit: '2024-01-09', totalVisits: 9, status: 'active' },
  { id: 'p13', name: 'Mia Anderson', email: 'mia.a@email.com', phone: '(555) 555-6666', dateOfBirth: '1993-07-07', bloodGroup: 'O-', gender: 'female', address: '174 Redwood Place, Nashville', lastVisit: '2024-01-07', totalVisits: 11, status: 'active' },
  { id: 'p14', name: 'Christopher Davis', email: 'cdavis@email.com', phone: '(555) 777-8888', dateOfBirth: '1968-03-30', bloodGroup: 'AB+', gender: 'male', address: '285 Sequoia Blvd, Minneapolis', lastVisit: '2023-12-28', totalVisits: 14, status: 'active' },
  { id: 'p15', name: 'Charlotte Moore', email: 'cmoore@email.com', phone: '(555) 999-0000', dateOfBirth: '1987-11-11', bloodGroup: 'B-', gender: 'female', address: '396 Magnolia Circle, Orlando', lastVisit: '2024-01-06', totalVisits: 8, status: 'active' },
  { id: 'p16', name: 'Benjamin Clark', email: 'bclark@email.com', phone: '(555) 222-3333', dateOfBirth: '1972-09-05', bloodGroup: 'A+', gender: 'male', address: '507 Juniper Road, Raleigh', lastVisit: '2023-11-20', totalVisits: 6, status: 'inactive' },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-15', time: '09:00', status: 'completed', type: 'General Checkup', notes: 'Routine examination' },
  { id: 'a2', patientId: 'p2', patientName: 'Michael Chen', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-15', time: '09:30', status: 'completed', type: 'Follow-up', notes: 'Post-surgery follow up' },
  { id: 'a3', patientId: 'p3', patientName: 'Emily Rodriguez', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-15', time: '10:00', status: 'in-progress', type: 'Consultation', notes: 'New patient consultation' },
  { id: 'a4', patientId: 'p4', patientName: 'James Wilson', doctorId: 's3', doctorName: 'Dr. Sarah Mitchell', date: '2024-01-15', time: '10:30', status: 'scheduled', type: 'Lab Review', notes: 'Blood work results review' },
  { id: 'a5', patientId: 'p5', patientName: 'Olivia Martinez', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-15', time: '11:00', status: 'scheduled', type: 'General Checkup', notes: '' },
  { id: 'a6', patientId: 'p6', patientName: 'David Kim', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-15', time: '11:30', status: 'cancelled', type: 'Dental Cleaning', notes: 'Patient requested cancellation' },
  { id: 'a7', patientId: 'p7', patientName: 'Sophia Brown', doctorId: 's3', doctorName: 'Dr. Sarah Mitchell', date: '2024-01-15', time: '14:00', status: 'scheduled', type: 'Vaccination', notes: 'Annual flu shot' },
  { id: 'a8', patientId: 'p8', patientName: 'Robert Taylor', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-15', time: '14:30', status: 'no-show', type: 'Follow-up', notes: '' },
  { id: 'a9', patientId: 'p9', patientName: 'Isabella Garcia', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-16', time: '09:00', status: 'scheduled', type: 'General Checkup', notes: '' },
  { id: 'a10', patientId: 'p10', patientName: 'William Lee', doctorId: 's3', doctorName: 'Dr. Sarah Mitchell', date: '2024-01-16', time: '09:30', status: 'scheduled', type: 'Consultation', notes: 'Referred by Dr. Park' },
  { id: 'a11', patientId: 'p11', patientName: 'Ava Thompson', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-16', time: '10:00', status: 'scheduled', type: 'Physical Therapy', notes: 'Shoulder pain' },
  { id: 'a12', patientId: 'p12', patientName: 'Daniel White', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-16', time: '10:30', status: 'scheduled', type: 'Follow-up', notes: '' },
  { id: 'a13', patientId: 'p13', patientName: 'Mia Anderson', doctorId: 's3', doctorName: 'Dr. Sarah Mitchell', date: '2024-01-16', time: '11:00', status: 'scheduled', type: 'General Checkup', notes: '' },
  { id: 'a14', patientId: 'p14', patientName: 'Christopher Davis', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-16', time: '11:30', status: 'scheduled', type: 'Lab Review', notes: 'Cholesterol levels' },
  { id: 'a15', patientId: 'p15', patientName: 'Charlotte Moore', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-16', time: '14:00', status: 'scheduled', type: 'Consultation', notes: '' },
  { id: 'a16', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 's3', doctorName: 'Dr. Sarah Mitchell', date: '2024-01-17', time: '09:00', status: 'scheduled', type: 'Follow-up', notes: '' },
  { id: 'a17', patientId: 'p3', patientName: 'Emily Rodriguez', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-17', time: '09:30', status: 'scheduled', type: 'Vaccination', notes: '' },
  { id: 'a18', patientId: 'p5', patientName: 'Olivia Martinez', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-17', time: '10:00', status: 'scheduled', type: 'General Checkup', notes: '' },
  { id: 'a19', patientId: 'p7', patientName: 'Sophia Brown', doctorId: 's3', doctorName: 'Dr. Sarah Mitchell', date: '2024-01-17', time: '10:30', status: 'scheduled', type: 'Follow-up', notes: '' },
  { id: 'a20', patientId: 'p9', patientName: 'Isabella Garcia', doctorId: 's2', doctorName: 'Dr. Richard Park', date: '2024-01-17', time: '11:00', status: 'scheduled', type: 'Consultation', notes: '' },
  { id: 'a21', patientId: 'p11', patientName: 'Ava Thompson', doctorId: 's1', doctorName: 'Dr. Amanda Foster', date: '2024-01-17', time: '14:00', status: 'scheduled', type: 'Physical Therapy', notes: '' },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2024-001', patientId: 'p1', patientName: 'Sarah Johnson', items: [{ name: 'General Consultation', quantity: 1, unitPrice: 150, total: 150 }, { name: 'Blood Test', quantity: 1, unitPrice: 75, total: 75 }], subtotal: 225, tax: 11.25, discount: 0, total: 236.25, status: 'paid', createdAt: '2024-01-15', dueDate: '2024-02-15' },
  { id: 'inv2', invoiceNumber: 'INV-2024-002', patientId: 'p2', patientName: 'Michael Chen', items: [{ name: 'Surgery Follow-up', quantity: 1, unitPrice: 200, total: 200 }], subtotal: 200, tax: 10, discount: 20, total: 190, status: 'paid', createdAt: '2024-01-12', dueDate: '2024-02-12' },
  { id: 'inv3', invoiceNumber: 'INV-2024-003', patientId: 'p3', patientName: 'Emily Rodriguez', items: [{ name: 'New Patient Consultation', quantity: 1, unitPrice: 175, total: 175 }, { name: 'X-Ray', quantity: 2, unitPrice: 100, total: 200 }], subtotal: 375, tax: 18.75, discount: 0, total: 393.75, status: 'pending', createdAt: '2024-01-10', dueDate: '2024-02-10' },
  { id: 'inv4', invoiceNumber: 'INV-2024-004', patientId: 'p4', patientName: 'James Wilson', items: [{ name: 'Lab Review', quantity: 1, unitPrice: 100, total: 100 }, { name: 'Prescription', quantity: 3, unitPrice: 25, total: 75 }], subtotal: 175, tax: 8.75, discount: 10, total: 173.75, status: 'overdue', createdAt: '2023-12-20', dueDate: '2024-01-20' },
  { id: 'inv5', invoiceNumber: 'INV-2024-005', patientId: 'p5', patientName: 'Olivia Martinez', items: [{ name: 'General Checkup', quantity: 1, unitPrice: 150, total: 150 }], subtotal: 150, tax: 7.5, discount: 0, total: 157.5, status: 'paid', createdAt: '2024-01-08', dueDate: '2024-02-08' },
  { id: 'inv6', invoiceNumber: 'INV-2024-006', patientId: 'p7', patientName: 'Sophia Brown', items: [{ name: 'Vaccination', quantity: 1, unitPrice: 50, total: 50 }, { name: 'Consultation', quantity: 1, unitPrice: 150, total: 150 }], subtotal: 200, tax: 10, discount: 0, total: 210, status: 'pending', createdAt: '2024-01-14', dueDate: '2024-02-14' },
  { id: 'inv7', invoiceNumber: 'INV-2024-007', patientId: 'p8', patientName: 'Robert Taylor', items: [{ name: 'Physical Therapy', quantity: 4, unitPrice: 80, total: 320 }], subtotal: 320, tax: 16, discount: 30, total: 306, status: 'paid', createdAt: '2024-01-05', dueDate: '2024-02-05' },
  { id: 'inv8', invoiceNumber: 'INV-2024-008', patientId: 'p9', patientName: 'Isabella Garcia', items: [{ name: 'Dental Cleaning', quantity: 1, unitPrice: 120, total: 120 }], subtotal: 120, tax: 6, discount: 0, total: 126, status: 'pending', createdAt: '2024-01-11', dueDate: '2024-02-11' },
  { id: 'inv9', invoiceNumber: 'INV-2024-009', patientId: 'p12', patientName: 'Daniel White', items: [{ name: 'MRI Scan', quantity: 1, unitPrice: 500, total: 500 }, { name: 'Consultation', quantity: 1, unitPrice: 150, total: 150 }], subtotal: 650, tax: 32.5, discount: 50, total: 632.5, status: 'overdue', createdAt: '2023-12-15', dueDate: '2024-01-15' },
  { id: 'inv10', invoiceNumber: 'INV-2024-010', patientId: 'p13', patientName: 'Mia Anderson', items: [{ name: 'General Checkup', quantity: 1, unitPrice: 150, total: 150 }, { name: 'Blood Panel', quantity: 1, unitPrice: 200, total: 200 }], subtotal: 350, tax: 17.5, discount: 0, total: 367.5, status: 'paid', createdAt: '2024-01-07', dueDate: '2024-02-07' },
  { id: 'inv11', invoiceNumber: 'INV-2024-011', patientId: 'p14', patientName: 'Christopher Davis', items: [{ name: 'Cardiology Consultation', quantity: 1, unitPrice: 250, total: 250 }], subtotal: 250, tax: 12.5, discount: 0, total: 262.5, status: 'pending', createdAt: '2024-01-09', dueDate: '2024-02-09' },
  { id: 'inv12', invoiceNumber: 'INV-2024-012', patientId: 'p15', patientName: 'Charlotte Moore', items: [{ name: 'Dermatology Visit', quantity: 1, unitPrice: 180, total: 180 }, { name: 'Prescription', quantity: 2, unitPrice: 30, total: 60 }], subtotal: 240, tax: 12, discount: 0, total: 252, status: 'paid', createdAt: '2024-01-06', dueDate: '2024-02-06' },
];

export const mockStaff: Staff[] = [
  { id: 's1', name: 'Dr. Amanda Foster', email: 'amanda.foster@clinic.com', phone: '(555) 100-2001', role: 'doctor', specialization: 'General Medicine', joinDate: '2020-03-15', status: 'active', avatar: '' },
  { id: 's2', name: 'Dr. Richard Park', email: 'richard.park@clinic.com', phone: '(555) 100-2002', role: 'doctor', specialization: 'Cardiology', joinDate: '2019-08-01', status: 'active', avatar: '' },
  { id: 's3', name: 'Dr. Sarah Mitchell', email: 'sarah.mitchell@clinic.com', phone: '(555) 100-2003', role: 'doctor', specialization: 'Pediatrics', joinDate: '2021-01-10', status: 'active', avatar: '' },
  { id: 's4', name: 'Dr. James Cooper', email: 'james.cooper@clinic.com', phone: '(555) 100-2004', role: 'doctor', specialization: 'Orthopedics', joinDate: '2018-06-20', status: 'active', avatar: '' },
  { id: 's5', name: 'Lisa Wang', email: 'lisa.wang@clinic.com', phone: '(555) 100-3001', role: 'nurse', specialization: 'Emergency Care', joinDate: '2020-09-01', status: 'active', avatar: '' },
  { id: 's6', name: 'Mark Thompson', email: 'mark.thompson@clinic.com', phone: '(555) 100-3002', role: 'nurse', specialization: 'Surgical', joinDate: '2021-05-15', status: 'active', avatar: '' },
  { id: 's7', name: 'Jennifer Adams', email: 'jennifer.adams@clinic.com', phone: '(555) 100-4001', role: 'receptionist', specialization: '', joinDate: '2022-02-01', status: 'active', avatar: '' },
  { id: 's8', name: 'Kevin Rodriguez', email: 'kevin.rodriguez@clinic.com', phone: '(555) 100-5001', role: 'admin', specialization: '', joinDate: '2019-01-15', status: 'active', avatar: '' },
  { id: 's9', name: 'Dr. Emily Zhao', email: 'emily.zhao@clinic.com', phone: '(555) 100-2005', role: 'doctor', specialization: 'Dermatology', joinDate: '2022-07-01', status: 'inactive', avatar: '' },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'appointment', title: 'New Appointment', message: 'Sarah Johnson booked an appointment for Jan 15 at 9:00 AM', timestamp: '2024-01-14T10:30:00', read: false },
  { id: 'n2', type: 'billing', title: 'Payment Received', message: 'Payment of $236.25 received from Sarah Johnson (INV-2024-001)', timestamp: '2024-01-14T09:15:00', read: false },
  { id: 'n3', type: 'patient', title: 'New Patient Registered', message: 'Ava Thompson has registered as a new patient', timestamp: '2024-01-13T16:45:00', read: false },
  { id: 'n4', type: 'system', title: 'System Update', message: 'Clinic OS has been updated to version 2.1.0', timestamp: '2024-01-13T08:00:00', read: true },
  { id: 'n5', type: 'appointment', title: 'Appointment Cancelled', message: 'David Kim cancelled his appointment for Jan 15 at 11:30 AM', timestamp: '2024-01-12T14:20:00', read: true },
  { id: 'n6', type: 'billing', title: 'Invoice Overdue', message: 'Invoice INV-2024-004 for James Wilson is now overdue', timestamp: '2024-01-12T09:00:00', read: false },
  { id: 'n7', type: 'patient', title: 'Patient Update', message: 'Robert Taylor updated his contact information', timestamp: '2024-01-11T11:30:00', read: true },
  { id: 'n8', type: 'appointment', title: 'Appointment Reminder', message: '5 appointments scheduled for tomorrow', timestamp: '2024-01-11T08:00:00', read: true },
  { id: 'n9', type: 'system', title: 'Backup Complete', message: 'Daily database backup completed successfully', timestamp: '2024-01-10T23:00:00', read: true },
  { id: 'n10', type: 'billing', title: 'Monthly Report', message: 'January billing report is ready for review', timestamp: '2024-01-10T09:00:00', read: false },
  { id: 'n11', type: 'appointment', title: 'No-show Alert', message: 'Robert Taylor did not show up for his appointment', timestamp: '2024-01-09T15:00:00', read: true },
  { id: 'n12', type: 'patient', title: 'Lab Results Ready', message: 'Lab results are ready for Christopher Davis', timestamp: '2024-01-09T10:30:00', read: true },
];

export const mockActivityFeed: ActivityFeed[] = [
  { id: 'act1', type: 'appointment', message: 'Dr. Foster completed appointment with Sarah Johnson', timestamp: '2024-01-15T09:45:00', user: 'Dr. Amanda Foster' },
  { id: 'act2', type: 'patient', message: 'New patient Ava Thompson registered', timestamp: '2024-01-15T09:30:00', user: 'Jennifer Adams' },
  { id: 'act3', type: 'billing', message: 'Invoice INV-2024-001 marked as paid', timestamp: '2024-01-15T09:15:00', user: 'Kevin Rodriguez' },
  { id: 'act4', type: 'appointment', message: 'Emily Rodriguez checked in for consultation', timestamp: '2024-01-15T09:55:00', user: 'Jennifer Adams' },
  { id: 'act5', type: 'prescription', message: 'Dr. Park prescribed medication for Michael Chen', timestamp: '2024-01-15T09:40:00', user: 'Dr. Richard Park' },
  { id: 'act6', type: 'appointment', message: 'David Kim cancelled his appointment', timestamp: '2024-01-14T14:20:00', user: 'David Kim' },
  { id: 'act7', type: 'system', message: 'System backup completed', timestamp: '2024-01-14T23:00:00', user: 'System' },
  { id: 'act8', type: 'billing', message: 'Created invoice INV-2024-012 for Charlotte Moore', timestamp: '2024-01-14T11:00:00', user: 'Kevin Rodriguez' },
  { id: 'act9', type: 'patient', message: 'Updated records for Robert Taylor', timestamp: '2024-01-14T10:30:00', user: 'Lisa Wang' },
  { id: 'act10', type: 'appointment', message: 'Dr. Mitchell completed appointment with Sophia Brown', timestamp: '2024-01-14T10:00:00', user: 'Dr. Sarah Mitchell' },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: { value: 1284, percentChange: 12.5 },
  appointmentsToday: { value: 24, percentChange: 8.2 },
  monthlyRevenue: { value: 48750, percentChange: 15.3 },
  activeDoctors: { value: 8, percentChange: 0 },
};

export const weeklyChartData = [
  { day: 'Mon', appointments: 18 },
  { day: 'Tue', appointments: 22 },
  { day: 'Wed', appointments: 15 },
  { day: 'Thu', appointments: 28 },
  { day: 'Fri', appointments: 24 },
  { day: 'Sat', appointments: 12 },
  { day: 'Sun', appointments: 5 },
];

export const monthlyRevenueData = [
  { month: 'Aug', revenue: 35200 },
  { month: 'Sep', revenue: 38400 },
  { month: 'Oct', revenue: 42100 },
  { month: 'Nov', revenue: 39800 },
  { month: 'Dec', revenue: 45600 },
  { month: 'Jan', revenue: 48750 },
];

export const mockClinicSettings: ClinicSettings = {
  general: {
    name: 'HealthCare Plus Clinic',
    address: '456 Medical Center Blvd, Suite 200, Springfield, IL 62701',
    phone: '(555) 100-1000',
    email: 'info@healthcareplus.com',
  },
  workingHours: [
    { day: 'Monday', start: '08:00', end: '18:00', isOff: false },
    { day: 'Tuesday', start: '08:00', end: '18:00', isOff: false },
    { day: 'Wednesday', start: '08:00', end: '18:00', isOff: false },
    { day: 'Thursday', start: '08:00', end: '18:00', isOff: false },
    { day: 'Friday', start: '08:00', end: '17:00', isOff: false },
    { day: 'Saturday', start: '09:00', end: '13:00', isOff: false },
    { day: 'Sunday', start: '00:00', end: '00:00', isOff: true },
  ],
  holidays: [
    { id: 'h1', name: "New Year's Day", date: '2024-01-01' },
    { id: 'h2', name: 'Independence Day', date: '2024-07-04' },
    { id: 'h3', name: 'Thanksgiving', date: '2024-11-28' },
    { id: 'h4', name: 'Christmas Day', date: '2024-12-25' },
  ],
  services: [
    { id: 'svc1', name: 'General Consultation', duration: 30, price: 150 },
    { id: 'svc2', name: 'Follow-up Visit', duration: 15, price: 100 },
    { id: 'svc3', name: 'Physical Therapy Session', duration: 45, price: 80 },
    { id: 'svc4', name: 'Blood Test', duration: 15, price: 75 },
    { id: 'svc5', name: 'X-Ray', duration: 20, price: 100 },
    { id: 'svc6', name: 'Vaccination', duration: 10, price: 50 },
    { id: 'svc7', name: 'MRI Scan', duration: 60, price: 500 },
    { id: 'svc8', name: 'Dental Cleaning', duration: 30, price: 120 },
  ],
};


// ===== Extended data for modern dashboard, analytics & pharmacy =====

// Sparkline trends for stat cards
export const patientsSparkline = [
  { value: 980 }, { value: 1020 }, { value: 1080 }, { value: 1110 }, { value: 1180 }, { value: 1230 }, { value: 1284 },
];
export const appointmentsSparkline = [
  { value: 14 }, { value: 18 }, { value: 16 }, { value: 22 }, { value: 19 }, { value: 21 }, { value: 24 },
];
export const revenueSparkline = [
  { value: 35200 }, { value: 38400 }, { value: 42100 }, { value: 39800 }, { value: 45600 }, { value: 47200 }, { value: 48750 },
];
export const doctorsSparkline = [
  { value: 6 }, { value: 6 }, { value: 7 }, { value: 7 }, { value: 8 }, { value: 8 }, { value: 8 },
];

// Revenue area chart (richer, with target)
export const revenueTrendData = [
  { month: 'Aug', revenue: 35200, target: 40000 },
  { month: 'Sep', revenue: 38400, target: 40000 },
  { month: 'Oct', revenue: 42100, target: 42000 },
  { month: 'Nov', revenue: 39800, target: 44000 },
  { month: 'Dec', revenue: 45600, target: 46000 },
  { month: 'Jan', revenue: 48750, target: 48000 },
];

// Appointment status breakdown (donut)
export const appointmentStatusData = [
  { name: 'Completed', value: 142, color: '#10b981' },
  { name: 'Scheduled', value: 86, color: '#3b82f6' },
  { name: 'Cancelled', value: 18, color: '#f43f5e' },
  { name: 'No-show', value: 9, color: '#94a3b8' },
];

// Patient demographics by age (bar)
export const demographicsData = [
  { group: '0-17', male: 42, female: 38 },
  { group: '18-34', male: 120, female: 145 },
  { group: '35-50', male: 168, female: 182 },
  { group: '51-65', male: 134, female: 128 },
  { group: '65+', male: 88, female: 109 },
];

// Gender split (donut)
export const genderSplitData = [
  { name: 'Female', value: 602, color: '#f472b6' },
  { name: 'Male', value: 552, color: '#60a5fa' },
  { name: 'Other', value: 30, color: '#a78bfa' },
];

// Revenue by service category (bar)
export const revenueByCategoryData = [
  { category: 'Consultation', revenue: 18400 },
  { category: 'Lab Tests', revenue: 9200 },
  { category: 'Imaging', revenue: 11800 },
  { category: 'Procedures', revenue: 6100 },
  { category: 'Pharmacy', revenue: 3250 },
];

// Payment methods (donut)
export const paymentMethodData = [
  { name: 'Card', value: 48, color: '#3b82f6' },
  { name: 'Cash', value: 22, color: '#10b981' },
  { name: 'Insurance', value: 24, color: '#8b5cf6' },
  { name: 'Online', value: 6, color: '#f59e0b' },
];

// Doctor performance (table/bar)
export interface DoctorPerformance {
  id: string;
  name: string;
  specialization: string;
  appointments: number;
  revenue: number;
  rating: number;
  avgMinutes: number;
}
export const doctorPerformanceData: DoctorPerformance[] = [
  { id: 's1', name: 'Dr. Amanda Foster', specialization: 'General Medicine', appointments: 86, revenue: 12900, rating: 4.9, avgMinutes: 22 },
  { id: 's2', name: 'Dr. Richard Park', specialization: 'Cardiology', appointments: 64, revenue: 16000, rating: 4.8, avgMinutes: 31 },
  { id: 's3', name: 'Dr. Sarah Mitchell', specialization: 'Pediatrics', appointments: 72, revenue: 9800, rating: 4.7, avgMinutes: 18 },
  { id: 's4', name: 'Dr. James Cooper', specialization: 'Orthopedics', appointments: 51, revenue: 14200, rating: 4.6, avgMinutes: 27 },
  { id: 's9', name: 'Dr. Emily Zhao', specialization: 'Dermatology', appointments: 38, revenue: 6840, rating: 4.5, avgMinutes: 20 },
];

// Weekly appointment activity by hour (heatmap)
export const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const heatmapHours = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p'];
// values 0-5 intensity
export const heatmapData: number[][] = [
  [2, 4, 5, 3, 1, 0, 3, 4, 2, 1],
  [3, 5, 4, 4, 2, 1, 4, 5, 3, 2],
  [1, 3, 4, 2, 1, 0, 2, 3, 4, 1],
  [4, 5, 5, 4, 2, 1, 5, 4, 3, 2],
  [3, 4, 5, 3, 2, 1, 3, 4, 2, 1],
  [1, 2, 3, 2, 0, 0, 1, 2, 1, 0],
];

// ===== Pharmacy / Inventory =====
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops';
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export const mockMedicines: Medicine[] = [
  { id: 'm1', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'capsule', manufacturer: 'PharmaCorp', batchNumber: 'AMX-2401', expiryDate: '2025-08-15', quantity: 420, minStockLevel: 100, unitPrice: 0.85, status: 'in-stock' },
  { id: 'm2', name: 'Paracetamol 650mg', genericName: 'Acetaminophen', category: 'tablet', manufacturer: 'MediLife', batchNumber: 'PCM-2398', expiryDate: '2026-02-20', quantity: 1200, minStockLevel: 200, unitPrice: 0.12, status: 'in-stock' },
  { id: 'm3', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'tablet', manufacturer: 'HealWell', batchNumber: 'IBU-2375', expiryDate: '2025-05-10', quantity: 78, minStockLevel: 150, unitPrice: 0.20, status: 'low-stock' },
  { id: 'm4', name: 'Cough Syrup', genericName: 'Dextromethorphan', category: 'syrup', manufacturer: 'PharmaCorp', batchNumber: 'CSY-2310', expiryDate: '2024-12-01', quantity: 0, minStockLevel: 40, unitPrice: 4.50, status: 'out-of-stock' },
  { id: 'm5', name: 'Insulin Glargine', genericName: 'Insulin', category: 'injection', manufacturer: 'BioGen', batchNumber: 'INS-2402', expiryDate: '2025-03-30', quantity: 64, minStockLevel: 30, unitPrice: 28.00, status: 'in-stock' },
  { id: 'm6', name: 'Hydrocortisone Cream', genericName: 'Hydrocortisone', category: 'cream', manufacturer: 'DermaCare', batchNumber: 'HYD-2388', expiryDate: '2025-09-12', quantity: 36, minStockLevel: 50, unitPrice: 3.20, status: 'low-stock' },
  { id: 'm7', name: 'Eye Drops Lubricant', genericName: 'Carboxymethylcellulose', category: 'drops', manufacturer: 'VisionPlus', batchNumber: 'EYE-2391', expiryDate: '2026-01-08', quantity: 210, minStockLevel: 60, unitPrice: 5.75, status: 'in-stock' },
  { id: 'm8', name: 'Metformin 500mg', genericName: 'Metformin', category: 'tablet', manufacturer: 'MediLife', batchNumber: 'MET-2360', expiryDate: '2025-07-22', quantity: 540, minStockLevel: 120, unitPrice: 0.18, status: 'in-stock' },
  { id: 'm9', name: 'Azithromycin 250mg', genericName: 'Azithromycin', category: 'tablet', manufacturer: 'HealWell', batchNumber: 'AZI-2405', expiryDate: '2025-04-18', quantity: 92, minStockLevel: 100, unitPrice: 1.10, status: 'low-stock' },
  { id: 'm10', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'capsule', manufacturer: 'PharmaCorp', batchNumber: 'OMP-2412', expiryDate: '2026-03-25', quantity: 380, minStockLevel: 100, unitPrice: 0.30, status: 'in-stock' },
  { id: 'm11', name: 'Salbutamol Inhaler', genericName: 'Albuterol', category: 'drops', manufacturer: 'RespiCare', batchNumber: 'SAL-2399', expiryDate: '2025-06-14', quantity: 48, minStockLevel: 25, unitPrice: 12.40, status: 'in-stock' },
  { id: 'm12', name: 'Diclofenac Gel', genericName: 'Diclofenac', category: 'cream', manufacturer: 'HealWell', batchNumber: 'DIC-2384', expiryDate: '2024-11-30', quantity: 0, minStockLevel: 35, unitPrice: 6.10, status: 'out-of-stock' },
];

export interface PharmacyStats {
  totalItems: number;
  inventoryValue: number;
  lowStockCount: number;
  expiringSoonCount: number;
}
export const mockPharmacyStats: PharmacyStats = {
  totalItems: mockMedicines.length,
  inventoryValue: mockMedicines.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0),
  lowStockCount: mockMedicines.filter((m) => m.status === 'low-stock').length,
  expiringSoonCount: 3,
};

// Today's schedule for dashboard
export const todaySchedule = mockAppointments
  .filter((a) => a.date === '2024-01-15')
  .map((a) => ({ id: a.id, time: a.time, patient: a.patientName, doctor: a.doctorName, type: a.type, status: a.status }));
