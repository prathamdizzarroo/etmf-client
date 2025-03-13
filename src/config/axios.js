import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL); // Debugging

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export default axiosInstance;
