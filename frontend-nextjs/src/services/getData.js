import { client } from "./clientUtils";

export const getData = async () => {
  const { data, response } = await client.get(`/boards`);
  if (response.ok) {
    return data.data;
  }
};
