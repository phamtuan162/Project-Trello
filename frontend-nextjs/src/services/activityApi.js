import authorizedAxiosInstance from "@/utils/authorizedAxios";
export const createActivity = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/activity`,
    body
  );
  return data;
};
