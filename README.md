
# Doctor Appointment Booking System

This is a web application for students to book appointments with doctors at RUET Medical Center. The system allows students to view available doctors, book appointments, and manage their bookings through a secure dashboard.

## Features

- **Doctor Listings:** Browse all available doctors and their specialties.
- **Student Login:** Secure authentication for students.
- **Book Appointment:** Book an appointment with a specific doctor.
- **Dashboard:** View and manage your appointments (protected route).
- **Responsive UI:** Modern, mobile-friendly design using shadcn-ui and Tailwind CSS.
- **Notifications:** Toast notifications for user feedback.
- **404 Page:** Custom not found page for invalid routes.

## Technologies Used

- React
- TypeScript
- Vite
- React Router
- shadcn-ui
- Tailwind CSS
- React Query

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or bun

### Installation

1. Clone the repository:
   ```sh
   git clone <YOUR_GIT_URL>
   cd ruet_medical_client
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   bun install
   ```
3. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

The app will be available at `http://localhost:5173` by default.

## Project Structure

- `src/pages/` — Main pages (Home, Login, Dashboard, BookAppointment, NotFound)
- `src/components/` — Reusable UI and logic components
- `src/components/ui/` — UI primitives (button, card, dialog, etc.)
- `src/data/` — Static data (e.g., doctors list)
- `src/firebase/` — Firebase initialization
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utility functions

## Deployment

You can deploy this app to any static hosting provider (Vercel, Netlify, etc.) after building:

```sh
npm run build
# or
bun run build
```

## License

This project is for educational purposes at RUET. Feel free to use and modify for your own needs.
