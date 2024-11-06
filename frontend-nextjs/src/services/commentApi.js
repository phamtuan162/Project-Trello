import authorizedAxiosInstance from "@/utils/authorizedAxios";
export const createComment = async (body) => {
  const { data } = await authorizedAxiosInstance.post(`/comment`, body);

  return data;
};
export const deleteCommentApi = async (commentID) => {
  const { data } = await authorizedAxiosInstance.delete(
    `/comment/${commentID}`
  );

  return data;
};
export const updateCommentApi = async (commentID, body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/comment/${commentID}`,
    body
  );

  return data;
};
