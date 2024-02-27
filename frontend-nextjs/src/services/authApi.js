// import axios from "axios";
// import { API_ROOT } from "@/utils/constants";
import { client } from "@/services/clientUtils";
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

/** Profile */
export const getProfile = async (access_token) => {
  const { response, data } = await client.post(`/auth/profile`, access_token);
  return data;
};
