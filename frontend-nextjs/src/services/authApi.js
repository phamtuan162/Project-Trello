// import axios from "axios";
// import { API_ROOT } from "@/utils/constants";
import { client } from "@/services/clientUtils";
import Cookies from "js-cookie";
import { handleRefreshTokenExpired } from "./handleRefreshTokenExpried";
/** Access-token */
export const getAccessToken = async () => {
  const refresh_token = Cookies.get("refresh_token");
  if (refresh_token) {
    const { data } = await client.post(`/auth/refresh`, {
      refresh_token: refresh_token,
    });
    if (data.status === 200) {
      return data.access_token;
    } else {
      // handleRefreshTokenExpired();
    }
  } else {
    // handleRefreshTokenExpired();
  }
};

/** Login */
export const loginLocalApi = async (body) => {
  const { response, data } = await client.post(`/auth/login`, body);
  return data;
};
export const loginGoogleApi = async () => {
  const { response, data } = await client.get(`/auth/google`);
  return data;
};

/** Register */
export const registerApi = async (body) => {
  const { response, data } = await client.post(`/auth/register`, body);
  return data;
};
/** Logout */
export const logoutApi = async () => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(
    `/auth/logout`,
    null,
    access_token
  );
  return data;
};
/** Profile */
export const getProfile = async (access_token) => {
  if (access_token) {
    const { data } = await client.get(`/auth/profile`, access_token);

    if (data.status === 200) {
      return data;
    }
  }
  const newAccessToken = await getAccessToken();
  return getProfile(newAccessToken);
};
