import axios, { AxiosError } from "axios";

const apiUrl: string =
  import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1";
// import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    const clientId = localStorage.getItem("client-id");
    if (clientId) {
      config.headers["x-client-id"] = `${clientId}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
