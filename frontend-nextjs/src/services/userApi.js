import { client } from "@/services/clientUtils";
import Cookies from "js-cookie";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
/** User */
export const getUser = async (userId) => {
  const { response, data } = await authorizedAxiosInstance.get(
    `/user/${userId}`
  );
  return data;
};
export const searchUser = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await authorizedAxiosInstance.get(
    `/user?${queryString}`
  );
  return data;
};

export const updateProfile = async (userId, body) => {
  const { data } = await authorizedAxiosInstance.put(`/user/${userId}`, body);
  return data;
};

export const updateAvatar = async (userId, formData) => {
  const access_token = Cookies.get("access_token");

  const result = await fetch(
    `http://localhost:3001/api/v1/user/update_avatar/${userId}`,
    {
      access_token: access_token,
      method: "POST",
      body: formData,
    }
  );
  const data = await result.json();
  return data;
};

export const deleteUser = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/user/delete`,
    body
  );
  return data;
};
