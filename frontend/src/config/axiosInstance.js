import axios from "axios";

const BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

export default axiosInstance;
