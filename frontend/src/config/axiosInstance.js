import axios from "axios";

const BASE_URL = "https://sacred-hearts.onrender.com/";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;
