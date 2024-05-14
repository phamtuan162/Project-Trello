import { client } from "@/services/clientUtils";
export const createComment = async (body) => {
  const { response, data } = await client.post(`/comment`, body);
  if (response.ok) {
    return data;
  }
};
export const deleteCommentApi = async (commentID) => {
  const { response, data } = await client.delete(`/comment/${commentID}`);
  if (response.ok) {
    return data;
  }
};
export const updateCommentApi = async (commentID, body) => {
  const { response, data } = await client.put(`/comment/${commentID}`, body);
  if (response.ok) {
    return data;
  }
};
