import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;
