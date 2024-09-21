import Cookies from "js-cookie";
import { client } from "@/services/clientUtils";
/** User */
export const getUser = async (userId) => {
  const { response, data } = await client.get(`/user/${userId}`);
  return data;
};
export const searchUser = async (query = {}) => {
  const access_token = Cookies.get("access_token");

  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await client.get(
    `/user?${queryString}`,
    access_token
  );
  return data;
};

export const updateProfile = async (userId, body) => {
  const { response, data } = await client.put(`/user/${userId}`, body);
  return data;
};

export const updateAvatar = async (userId, formData) => {
  const result = await fetch(
    `http://localhost:3001/api/v1/user/update_avatar/${userId}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await result.json();
  return data;
};

export const deleteUser = async (body) => {
  const { response, data } = await client.post(`/user/delete`, body);
  return data;
};
