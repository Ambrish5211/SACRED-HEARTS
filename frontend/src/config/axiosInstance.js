import axios from "axios";

const BASE_URL = "http://localhost:4000/api/v1/users/";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;
