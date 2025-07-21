import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const { user, isLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !isLoading && !!user?.email,
        queryFn: async () => {
            console.log('checking if user is admin/doctor', user);
            try {
                const res = await axiosSecure.get(`/doctors/admin/${user.email}`);
                console.log('Admin check response:', res.data);
                return res.data?.isAdmin || false;
            } catch (error: any) {
                console.log('Error checking admin status:', error.response?.status);
                
                // If it's a 403, user is not a doctor, return false instead of throwing
                if (error.response?.status === 403) {
                    return false;
                }
                
                // For other errors, also return false instead of throwing
                console.error('Admin check failed:', error);
                return false;
            }
        },
        retry: false, // Don't retry admin checks to avoid loops
        staleTime: 5 * 60 * 1000, // Cache admin status for 5 minutes
    });
    
    return [isAdmin, isAdminLoading];
};

export default useAdmin;