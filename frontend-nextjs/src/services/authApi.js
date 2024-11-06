import { toast } from "react-toastify";
import Cookies from "js-cookie";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
/** Access-token */
export const refreshTokenApi = async () => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/auth/refresh`
  );
  return data;
};

/** Login */
export const loginLocalApi = async (body) => {
  const { data } = await authorizedAxiosInstance.post(`/auth/login`, body);

  return data;
};

/* google*/
export const loginGoogleApi = async () => {
  const { response, data } = await authorizedAxiosInstance.get(
    `/auth/google/redirect`
  );
  return data;
};
export const loginGoogleCallbackApi = async (query) => {
  const queryString = new URLSearchParams(query).toString();

  const { data } = await authorizedAxiosInstance.get(
    `/auth/google/callback?${queryString}`
  );
  return data;
};

/* github*/

export const loginGithubApi = async () => {
  const { response, data } = await authorizedAxiosInstance.get(
    `/auth/github/redirect`
  );
  return data;
};

export const loginGithubCallbackApi = async (query) => {
  const queryString = new URLSearchParams(query).toString();

  const { data } = await authorizedAxiosInstance.get(
    `/auth/github/callback?${queryString}`
  );
  return data;
};

/** Register */
export const registerApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/auth/register`,
    body
  );
  return data;
};

export const verifyAccountApi = async (query, body) => {
  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await authorizedAxiosInstance.get(
    `/auth/verify?${queryString}`
  );
  return data;
};
/** Logout */
export const logoutApi = async (userId) => {
  try {
    const { data } = await authorizedAxiosInstance.post(
      `/auth/logout/${userId}`,
      null
    );
    const { status } = data;
    if (200 <= status && status <= 299) {
      Cookies.set("isLogin", false);
      toast.success("Đăng xuất thành công");
      window.location.href = "/auth/login";
    }
  } catch (error) {
    console.log(error);
  }
};
/** Profile */

export const getProfile = async () => {
  const { data, response } = await authorizedAxiosInstance.get(`/auth/profile`);

  return data;
};

/** Password */
export const changePasswordApi = async (userId, body) => {
  const { response, data } = await authorizedAxiosInstance.put(
    `/auth/change-password/${userId}`,
    body
  );
  return data;
};

export const forgotPasswordApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/auth/forgot-password`,
    body
  );
  return data;
};

export const resetPasswordApi = async (query, body) => {
  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await authorizedAxiosInstance.post(
    `/auth/reset-password?${queryString}`,
    body
  );
  return data;
};
