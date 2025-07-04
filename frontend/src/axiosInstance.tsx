import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
});
axiosInstance.interceptors.request.use(
    function (config: any) {
        return config;
    },
    function (error: any) {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    function (response: any) {
        return response; 
    },
    async function (error: any) {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.get("/auth/refresh-accessToken");
                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
