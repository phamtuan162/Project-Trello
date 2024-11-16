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
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const { data } = await authorizedAxiosInstance.post(
    `/user/update_avatar/${userId}`,
    formData,
    { headers }
  );
  return data;
};

export const deleteUser = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/user/delete`,
    body
  );
  return data;
};
