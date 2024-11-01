import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { interceptorLoadingElements } from "./formatters";
const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;

const authorizedAxiosInstance = axios.create({
  baseURL: API_ROOT,
  headers: {
    "Content-Type": "application/json",
  },
});

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

authorizedAxiosInstance.defaults.withCredentials = true;

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true);
    const access_token = Cookies.get("access_token");

    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    interceptorLoadingElements(false);

    let errorMessage = error?.message;

    if (error.response?.data?.error || error.response?.data?.message) {
      errorMessage =
        error.response?.data?.error || error.response?.data?.message;
    }

    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
