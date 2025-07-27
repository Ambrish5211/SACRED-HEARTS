import axios from "axios";

// "https://sacred-hearts.onrender.com/api/v1";

const BASE_URL = "http://localhost:4000/api/v1";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;
