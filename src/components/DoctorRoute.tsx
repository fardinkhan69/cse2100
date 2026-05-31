import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { fetchDoctorByEmail } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface DoctorRouteProps {
    children: React.ReactNode;
}

const DoctorRoute = ({ children }: DoctorRouteProps) => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error('DoctorRoute must be used within AuthProvider');
    const { user, isLoading } = authContext;
    const [isDoctorVerified, setIsDoctorVerified] = useState<boolean | null>(null);
    const [isCheckingDoctor, setIsCheckingDoctor] = useState(true);
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        const verifyDoctorStatus = async () => {
            if (isLoading) return;
            
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
                    // User is not a registered doctor — redirect but don't sign out
                    setIsDoctorVerified(false);
                    toast({
                        title: "Access Denied",
                        description: "You must be a registered doctor to access the doctor dashboard.",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                // On transient network errors, show error but don't sign out
                setIsDoctorVerified(false);
                toast({
                    title: "Verification Failed",
                    description: "Unable to verify your doctor status. Please check your connection and try again.",
                    variant: "destructive",
                });
            } finally {
                setIsCheckingDoctor(false);
            }
        };

        verifyDoctorStatus();
    }, [user, isLoading, toast]);

    if (isLoading || isCheckingDoctor) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-8 h-8 border-4 border-medical-medium border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-lg">Verifying doctor credentials...</span>
            </div>
        );
    }

    if (user && isDoctorVerified === true) {
        return <>{children}</>;
    }

    // Redirect to dashboard (not login) — user is still authenticated, just not a doctor
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default DoctorRoute;
