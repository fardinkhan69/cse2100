import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://ruet-medical-server.vercel.app'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;