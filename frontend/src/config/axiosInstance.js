import axios from "axios";

const BASE_URL = "https://movie-downloader-backend.onrender.com/api/v1";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;
