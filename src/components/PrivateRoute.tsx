import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({children}) => {
    const { user, isLoading } = useContext(AuthContext);
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-medium"></div>
            </div>
        );
    }

    // If user is authenticated, show the protected content
    if (user) {
        return children;
    }

    // If not authenticated, redirect to login with the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute