import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";
import { refreshTokenApi } from "@/services/authApi";
import { logoutApi } from "@/services/authApi";
import { API_ROOT } from "./constants";
// const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;

let authorizedAxiosInstance = axios.create({
  baseURL: `${API_ROOT}/api/v1`,
});

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

authorizedAxiosInstance.defaults.withCredentials = true;

let axiosReduceStore;
export const injectStore = (mainStore) => {
  axiosReduceStore = mainStore;
};

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
  async (error) => {
    const user = axiosReduceStore?.getState()?.user?.user;

    interceptorLoadingElements(false);

    if (error.response?.status === 403) {
      await logoutApi(user.id);
    }

    const originalRequests = error.config;

    if (error.response?.status === 410 && !originalRequests._retry) {
      originalRequests._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenApi()
          .then((data) => {
            return data?.access_token;
          })
          .catch(async (_error) => {
            await logoutApi(user.id);
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

    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }

    if (error.response?.status !== 410 && !error.response?.data?.isMessage) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
