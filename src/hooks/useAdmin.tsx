import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            console.log('checking if user is admin/doctor', user);
            try {
                const res = await axiosSecure.get(`/doctors/admin/${user.email}`);
                console.log('Admin check response:', res.data);
                return res.data?.isAdmin || false;
            } catch (error) {
                console.error('Error checking admin status:', error);
                return false;
            }
        }
    });
    
    return [isAdmin, isAdminLoading];
};

export default useAdmin;