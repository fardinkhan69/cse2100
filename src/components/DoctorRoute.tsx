import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { fetchDoctorByEmail } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface DoctorRouteProps {
    children: React.ReactNode;
}

const DoctorRoute = ({ children }: DoctorRouteProps) => {
    const { user, isLoading, signOutUser } = useContext(AuthContext);
    const [isDoctorVerified, setIsDoctorVerified] = useState<boolean | null>(null);
    const [isCheckingDoctor, setIsCheckingDoctor] = useState(true);
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const verifyDoctorStatus = async () => {
            // Don't check while auth is loading
            if (isLoading) return;
            
            // If no user, we'll redirect to login
            if (!user) {
                setIsCheckingDoctor(false);
                return;
            }

            try {
                setIsCheckingDoctor(true);
                const doctor = await fetchDoctorByEmail(user.email!);
                
                if (doctor) {
                    setIsDoctorVerified(true);
                } else {
                    // User is not a registered doctor - log them out and show message
                    setIsDoctorVerified(false);
                    toast({
                        title: "Access Denied",
                        description: "You must be a registered doctor to access the doctor dashboard. Please register as a doctor first.",
                        variant: "destructive",
                    });
                    
                    // Log out the user
                    await signOutUser();
                }
            } catch (error) {
                console.error('Error verifying doctor status:', error);
                setIsDoctorVerified(false);
                toast({
                    title: "Verification Failed",
                    description: "Unable to verify your doctor status. Please try again.",
                    variant: "destructive",
                });
                
                // Log out the user on error
                await signOutUser();
            } finally {
                setIsCheckingDoctor(false);
            }
        };

        verifyDoctorStatus();
    }, [user, isLoading, signOutUser, toast]);

    // Show loading while checking authentication or doctor status
    if (isLoading || isCheckingDoctor) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <span className="ml-3 text-lg">Verifying doctor credentials...</span>
            </div>
        );
    }

    // If user is verified doctor, show the protected content
    if (user && isDoctorVerified === true) {
        return <>{children}</>;
    }

    // Otherwise, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default DoctorRoute;
