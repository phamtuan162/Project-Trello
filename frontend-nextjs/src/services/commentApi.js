import { client } from "@/services/clientUtils";
export const createComment = async (body) => {
  const { data } = await client.post(`/comment`, body);

  return data;
};
export const deleteCommentApi = async (commentID) => {
  const { data } = await client.delete(`/comment/${commentID}`);

  return data;
};
export const updateCommentApi = async (commentID, body) => {
  const { data } = await client.put(`/comment/${commentID}`, body);

  return data;
};
