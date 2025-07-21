import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000'
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { signOutUser, user, isLoading, tokenReady } = useAuth();

    // request interceptor to add authorization header for every secure call to the api
    axiosSecure.interceptors.request.use(async function (config) {
        // If we have a user but token is not ready yet, wait
        if (user && !tokenReady) {
            console.log('Waiting for token to be ready...');
            // Wait up to 5 seconds for token to be ready
            let retries = 0;
            const maxRetries = 25; // 25 * 200ms = 5 seconds
            
            while (retries < maxRetries && user && !tokenReady) {
                await new Promise(resolve => setTimeout(resolve, 200));
                retries++;
                
                // Re-check tokenReady state (it might have been updated)
                const currentAuth = JSON.parse(localStorage.getItem('auth-context') || '{}');
                if (currentAuth.tokenReady || localStorage.getItem('access-token')) {
                    break;
                }
            }
        }
        
        const token = localStorage.getItem('access-token');
        console.log('Making API request to:', config.url, 'with token:', !!token, 'user:', !!user, 'tokenReady:', tokenReady);
        
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // intercepts 401 and 403 status
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        console.log('API Error:', status, 'for URL:', url, error.response?.data);
        
        // Only logout for token-related authentication errors
        if (status === 401) {
            const errorMessage = error.response?.data?.message?.toLowerCase() || '';
            
            // Check if it's actually a token issue
            if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('jwt')) {
                console.log('Token-related auth error, logging out...');
                await signOutUser();
                navigate('/login');
            }
        }
        
        return Promise.reject(error);
    })


    return axiosSecure;
};

export default useAxiosSecure;