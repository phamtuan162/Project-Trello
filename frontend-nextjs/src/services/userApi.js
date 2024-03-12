import { client } from "@/services/clientUtils";
/** User */
export const getUser = async (userId) => {
  const { response, data } = await client.get(`/user/${userId}`);
  return data;
};
export const searchUser = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await client.get(`/user?${queryString}`);
  return data;
};

export const updateProfile = async (userId, body) => {
  const { response, data } = await client.put(`/user/${userId}`, body);
  return data;
};

export const deleteUser = async (body) => {
  const { response, data } = await client.post(`/user/delete`, body);
  return data;
};
