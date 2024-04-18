import { client } from "@/services/clientUtils";
export const createActivity = async (body) => {
  const { response, data } = await client.post(`/activity`, body);
  if (response.ok) {
    return data;
  }
};
