import { client } from "./clientUtils";

export const getData = async () => {
  const { data, response } = await client.get(`/workspace`);
  if (response.ok) {
    return data.data;
  }
};
