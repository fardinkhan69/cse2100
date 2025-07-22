
"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import useAdmin from "@/hooks/useAdmin";

export default function NavbarDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle smooth scrolling for anchor links
  const handleAnchorClick = (anchor: string) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle home navigation - scroll to top if already on home
  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get user display name from Firebase user object
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    } else if (user?.email) {
      // Extract name from email (before @)
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get appropriate dashboard route based on user role
  const getDashboardRoute = () => {
    return isAdmin ? '/doctor-dashboard' : '/dashboard';
  };

  // Handle dashboard navigation
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const route = getDashboardRoute();
    navigate(route);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <NavLink
            to="/"
            onClick={handleHomeClick}
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
          >
            <div className="h-8 w-8 rounded-full bg-medical-medium flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-medium text-black dark:text-white">RUET Medical Center</span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2">
            <NavLink
              to="/"
              onClick={handleHomeClick}
              className={({ isActive }) =>
                `relative px-4 py-2 text-neutral-600 dark:text-neutral-300 ${
                  isActive ? 'text-medical-medium font-semibold' : ''
                }`
              }
            >
              Home
            </NavLink>

            <button
              onClick={() => handleAnchorClick("#doctors")}
              className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:text-medical-medium"
            >
              Doctors
            </button>

            <NavLink
              to={getDashboardRoute()}
              className={({ isActive }) =>
                `relative px-4 py-2 text-neutral-600 dark:text-neutral-300 ${
                  isActive ? 'text-medical-medium font-semibold' : ''
                }`
              }
            >
              Dashboard
            </NavLink>

          </div>

          {/* Dynamic User/Login Button */}
          <div className="flex items-center gap-4 relative z-[70] pointer-events-auto rounded-full">
            {user ? (
              // User is logged in - show user name linking to appropriate dashboard
              <button
                onClick={handleDashboardClick}
                className="relative z-[70] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-medical-medium text-white hover:bg-medical-dark h-10 px-4 py-2 cursor-pointer pointer-events-auto"
                title={isAdmin ? "Go to Doctor Dashboard" : "Go to Student Dashboard"}
              >
                {getUserDisplayName()}
                {isAdmin && <span className="ml-1 text-xs opacity-80">(Dr)</span>}
              </button>
            ) : (
              // User is not logged in - show login button
              <NavLink
                to="/login"
                className="relative z-[70] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-medical-medium text-white hover:bg-medical-dark h-10 px-4 py-2 cursor-pointer pointer-events-auto"
                onClick={() => {
                  console.log('Login button clicked!');
                }}
              >
                Login
              </NavLink>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavLink
              to="/"
              onClick={handleHomeClick}
              className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
            >
              <div className="h-8 w-8 rounded-full bg-medical-medium flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-medium text-black dark:text-white">RUET Medical Center</span>
            </NavLink>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <NavLink
              to="/"
              onClick={(e) => {
                handleHomeClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="relative text-neutral-600 dark:text-neutral-300 block py-2"
            >
              Home
            </NavLink>

            <button
              onClick={() => {
                handleAnchorClick("#doctors");
                setIsMobileMenuOpen(false);
              }}
              className="relative text-neutral-600 dark:text-neutral-300 text-left block py-2"
            >
              Doctors
            </button>

            <button
              onClick={() => {
                handleAnchorClick("#services");
                setIsMobileMenuOpen(false);
              }}
              className="relative text-neutral-600 dark:text-neutral-300 text-left block py-2"
            >
              Services
            </button>

            <NavLink
              to={getDashboardRoute()}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300 block py-2"
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/doctor-dashboard-demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300 block py-2"
            >
              Doctor Demo
            </NavLink>

            <NavLink
              to="/doctor-registration"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300 block py-2"
            >
              Doctor Registration
            </NavLink>

            <div className="flex w-full flex-col gap-4 mt-4">
              {user ? (
                // User is logged in - show user name linking to appropriate dashboard
                <button
                  onClick={() => {
                    handleDashboardClick;
                    setIsMobileMenuOpen(false);
                    const route = getDashboardRoute();
                    navigate(route);
                  }}
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-medical-medium text-white hover:bg-medical-dark h-10 px-4 py-2 cursor-pointer pointer-events-auto"
                  title={isAdmin ? "Go to Doctor Dashboard" : "Go to Student Dashboard"}
                >
                  {getUserDisplayName()}
                  {isAdmin && <span className="ml-1 text-xs opacity-80">(Dr)</span>}
                </button>
              ) : (
                // User is not logged in - show login button
                <NavLink
                  to="/login"
                  onClick={() => {
                    console.log('Mobile login button clicked!');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-medical-medium text-white hover:bg-medical-dark h-10 px-4 py-2 cursor-pointer pointer-events-auto"
                >
                  Login
                </NavLink>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
