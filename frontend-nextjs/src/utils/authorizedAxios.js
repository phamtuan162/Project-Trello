import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";
import { refreshTokenApi } from "@/services/authApi";
import { handleRefreshTokenExpired } from "@/services/handleRefreshTokenExpried";
const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;

let authorizedAxiosInstance = axios.create({
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

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false);

    return response;
  },
  (error) => {
    interceptorLoadingElements(false);

    if (error.response?.status === 403) {
      handleRefreshTokenExpired();
    }

    const originalRequests = error.config;

    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenApi()
          .then((data) => {
            return data?.access_token;
          })
          .catch((_error) => {
            handleRefreshTokenExpired();
            return Promise.reject(_error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      return refreshTokenPromise.then((access_token) => {
        return authorizedAxiosInstance(originalRequests);
      });
    }

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
