import { client } from "@/services/clientUtils";
import Cookies from "js-cookie";
/** User */
export const getUser = async (userId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.get(`/user/${userId}`, access_token);
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
  const access_token = Cookies.get("access_token");
  const { response, data } = await client.put(
    `/user/${userId}`,
    body,
    access_token
  );
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
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(
    `/user/delete`,
    body,
    access_token
  );
  return data;
};
