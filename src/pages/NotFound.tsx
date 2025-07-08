
/**
 * NotFound (404) Page Component
 * 
 * This page is displayed when users navigate to routes that don't exist
 * Provides a user-friendly error message and navigation back to home
 * 
 * Features:
 * - Consistent design with the rest of the application
 * - Clear error messaging
 * - Easy navigation back to home page
 * - Responsive layout
 */

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Log 404 errors for debugging and analytics
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  /**
   * Navigate back to home page
   */
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream font-poppins flex items-center justify-center px-4">
      
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-light/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-medical-medium/10 rounded-full blur-2xl"></div>
      
      <Card className="w-full max-w-md mx-auto bg-white shadow-xl border-0 rounded-xl relative z-10">
        <CardContent className="p-8 text-center space-y-6">
          
          {/* Error icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-10 h-10 text-orange-600" />
          </div>
          
          {/* Error message */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <h2 className="text-xl font-semibold text-gray-700">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Attempted route display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Attempted URL:</span>
              <br />
              <code className="text-xs bg-white px-2 py-1 rounded border">
                {location.pathname}
              </code>
            </p>
          </div>
          
          {/* Navigation options */}
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-medical-medium to-medical-dark hover:from-medical-dark hover:to-medical-medium text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home Page
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full border-medical-medium text-medical-dark hover:bg-medical-light hover:text-white transition-colors"
            >
              Go Back
            </Button>
          </div>

          {/* Helpful suggestions */}
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-medium text-blue-900 mb-2">
              💡 What you can do:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check the URL for typos</li>
              <li>• Go back to the previous page</li>
              <li>• Visit our home page to find doctors</li>
              <li>• Contact support if you need help</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
