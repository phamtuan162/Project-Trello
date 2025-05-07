import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";
import { refreshTokenApi, logoutApi } from "@/services/authApi";
import { API_ROOT } from "./constants";

const authorizedAxiosInstance = axios.create({
  baseURL: `${API_ROOT}/api/v1`,
  timeout: 1000 * 60 * 10, // 10 phút timeout
  withCredentials: true,
});

// Store injector function
let axiosReduceStore;
export const injectStore = (mainStore) => {
  axiosReduceStore = mainStore;
};

// Giữ refreshTokenPromise sống trong 5 giây
let refreshTokenPromise = null;
let refreshTokenTimeout = null;

function resetRefreshTokenPromise() {
  refreshTokenPromise = null;
  clearTimeout(refreshTokenTimeout);
  refreshTokenTimeout = null;
}

// Hàm refresh token xử lý chung
async function handleTokenRefresh(originalRequest, user) {
  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshTokenApi()
      .then(({ access_token }) => access_token)
      .catch(async (err) => {
        await logoutApi(user.id);
        return Promise.reject(err);
      });

    // Giữ promise trong 5 giây
    refreshTokenTimeout = setTimeout(resetRefreshTokenPromise, 5000);
  }

  // Dùng lại token sau khi đã refresh
  const access_token = await refreshTokenPromise;
  return authorizedAxiosInstance(originalRequest);
}

// Request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false);
    return response;
  },
  async (error) => {
    interceptorLoadingElements(false);
    const { response, config: originalRequest, message } = error;
    const user = axiosReduceStore?.getState()?.user?.user;

    if (!response) {
      toast.error("Lỗi không xác định");
      return Promise.reject(error);
    }

    const { status, data } = response;

    // Xử lý lỗi 403 - Forbidden
    if (status === 403) {
      const errorMessage = data?.message || message;
      toast.error(`${errorMessage} - Tự động đăng xuất sau 2 giây`);
      setTimeout(() => logoutApi(user.id), 2000);
      return;
    }

    // Xử lý lỗi 410 - Token hết hạn
    if (status === 410 && !originalRequest._retry) {
      originalRequest._retry = true;
      return handleTokenRefresh(originalRequest, user);
    }

    // // Hiển thị lỗi chung
    // if (status !== 410 && !data?.isMessage) {
    //   toast.error(data?.message || message);
    // }

    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
