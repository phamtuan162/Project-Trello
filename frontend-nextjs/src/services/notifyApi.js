import authorizedAxiosInstance from "@/utils/authorizedAxios";

/* Notification */
export const getNotificationsApi = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const { data } = await authorizedAxiosInstance.get(
    `/notification?${queryString}`
  );
  return data;
};

export const markAsReadNotification = async (body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/notification/mark-as-read`,
    body
  );
  return data;
};
export const clickNotification = async (body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/notification/click-notify`,
    body
  );
  return data;
};
