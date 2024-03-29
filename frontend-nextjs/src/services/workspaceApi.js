// import axios from "axios";
// import { API_ROOT } from "@/utils/constants";
import { client } from "@/services/clientUtils";
import { getAccessToken } from "./authApi";
import Cookies from "js-cookie";

/** Workspace */
export const getWorkspace = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();

  const { response, data } = await client.get(`/workspace?${queryString}`);
  if (response.ok) {
    return data.data;
  }
};
// export const getWorkspaceActive = async (query = {}) => {
//   const queryString = new URLSearchParams(query).toString();
//   const { response, data } = await client.get(`/workspace?${queryString}`);
//   if (data.status === 200) {
//     return data.data;
//   }
// };
export const createWorkspaceApi = async (userId, body) => {
  const { response, data } = await client.post(
    `/workspace?user_id=${userId}`,
    body
  );

  return data;
};
export const getWorkspaceDetail = async (workspaceId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.get(
    `/workspace/${workspaceId}`,
    access_token
  );
  if (response.ok || data.error) {
    if (data.status === 401) {
      window.location.href = "/";
    }
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await getWorkspaceDetail(workspaceId);
    }
  }
};
export const searchWorkspace = async (userId) => {
  const { response, data } = await client.get(`/workspace?user_id=${userId}`);
  if (response.ok) {
    return data.data;
  }
};

export const switchWorkspace = async (userId, body) => {
  const { response, data } = await client.put(`/user/${userId}`, body);
  if (response.ok) {
    return data.data;
  }
};

export const updateWorkspaceApi = async (workspaceId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/workspace/${workspaceId}`,
    body,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateWorkspaceApi(workspaceId, body);
    }
  }
};

export const deleteWorkspaceApi = async (workspaceId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/workspace/${workspaceId}`,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteWorkspaceApi();
    }
  }
};

export const inviteUserApi = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(
    `/workspace/invite`,
    body,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await inviteUserApi(body);
    }
  }
};

export const leaveWorkspaceApi = async (body) => {
  const { response, data } = await client.put(
    `/workspace/leave-workspace`,
    body
  );

  return data;
};
export const cancelUserWorkspaceApi = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/workspace/cancel-user`,
    body,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await cancelUserWorkspaceApi(body);
    }
  }
};
/** Board */

export const getBoard = async (workspaceId) => {
  const { response, data } = await client.get(
    `/board?workspace_id=${workspaceId}`
  );
  if (response.ok) {
    return data.data;
  }
};

export const getBoardDetail = async (boardId) => {
  const access_token = Cookies.get("access_token");
  const { response, data } = await client.get(
    `/board/${boardId}`,
    access_token
  );

  if (response.ok || data.error) {
    if (data.status === 401) {
      window.location.href = "/";
    }
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await getBoardDetail(boardId);
    }
  }
};

export const createBoard = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(`/board`, body, access_token);
  console.log(data, response.status);

  if (response.ok || data.error) {
    return data;
  } else {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createBoard(body);
    }
  }
};

export const updateBoardDetail = async (boardId, updateData) => {
  const { response, data } = await client.put(`/board/${boardId}`, updateData);
  if (response.ok) {
    return data.data;
  }
};

export const deleteBoard = async (boardId) => {
  const { response, data } = await client.delete(`/board/${boardId}`);
  if (response.ok) {
    return data.data;
  }
};

export const moveCardToDifferentColumnAPI = async (boardId, updateData) => {
  const { response, data } = await client.put(
    `/board/move-card/${boardId}`,
    updateData
  );
  if (response.ok) {
    return data.data;
  }
};

/** Column */

export const createColumn = async (body) => {
  const { response, data } = await client.post(`/column`, body);
  if (response.ok) {
    return data.data;
  }
};

export const updateColumnDetail = async (columnId, updateData) => {
  const { response, data } = await client.put(
    `/column/${columnId}`,
    updateData
  );
  if (response.ok) {
    return data.data;
  }
};

export const deleteColumn = async (columnId) => {
  const { response, data } = await client.delete(`/column/${columnId}`);
  if (response.ok) {
    return data.data;
  }
};

/** Card */
export const createCard = async (body) => {
  const { response, data } = await client.post(`/card`, body);
  if (response.ok) {
    return data.data;
  }
};
