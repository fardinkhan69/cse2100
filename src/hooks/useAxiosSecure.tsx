import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { API_BASE_URL } from "@/config/api";

const axiosSecure = axios.create({
    baseURL: API_BASE_URL
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { signOutUser, user, tokenReady } = useAuth();

    // request interceptor to add authorization header for every secure call to the api
    axiosSecure.interceptors.request.use(async function (config) {
        const token = localStorage.getItem('access-token');
        
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    // intercepts 401 and 403 status
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response?.status;
        
        // Only logout for definitive 401 token issues
        if (status === 401) {
            await signOutUser();
            navigate('/login');
        }
        
        return Promise.reject(error);
    })

    return axiosSecure;
};

export default useAxiosSecure;
