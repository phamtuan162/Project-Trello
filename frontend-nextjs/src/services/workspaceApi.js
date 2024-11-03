// import axios from "axios";
// import { API_ROOT } from "@/utils/constants";
import { client } from "@/services/clientUtils";
import { getAccessToken } from "./authApi";
import Cookies from "js-cookie";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
/** Workspace */
export const getWorkspace = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();

  const { data } = await authorizedAxiosInstance.get(
    `/workspace?${queryString}`
  );
  return data;
};
// export const getWorkspaceActive = async (query = {}) => {
//   const queryString = new URLSearchParams(query).toString();
//   const { response, data } = await client.get(`/workspace?${queryString}`);
//   if (data.status === 200) {
//     return data.data;
//   }
// };
export const createWorkspaceApi = async (userId, body) => {
  const { data } = await authorizedAxiosInstance.post(
    `/workspace?user_id=${userId}`,
    body
  );

  return data;
};
export const getWorkspaceDetail = async (workspaceId) => {
  const { data } = await authorizedAxiosInstance.get(
    `/workspace/${workspaceId}`
  );
  //   if (data.status === 404) {
  //     window.location.href = "/";
  //   }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await getWorkspaceDetail(workspaceId);
    }
  }
  return data;
};
export const searchWorkspace = async (userId) => {
  const { data } = await authorizedAxiosInstance.get(
    `/workspace?user_id=${userId}`
  );
  return data;
};

export const restoreWorkspaceApi = async (workspaceId) => {
  const { data } = await authorizedAxiosInstance.put(
    `/workspace/restore/${workspaceId}`
  );
  return data;
};

export const switchWorkspace = async (workspaceId, body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/workspace/change-workspace/${workspaceId}`,
    body
  );
  return data;
};

export const updateWorkspaceApi = async (workspaceId, body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/workspace/${workspaceId}`,
    body
  );

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateWorkspaceApi(workspaceId, body);
    }
  }
  return data;
};

export const deleteWorkspaceApi = async (workspaceId) => {
  const { data } = await authorizedAxiosInstance.delete(
    `/workspace/${workspaceId}`
  );

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteWorkspaceApi(workspaceId);
    }
  }
  return data;
};

export const inviteUserApi = async (body) => {
  const { data } = await authorizedAxiosInstance.post(
    `/workspace/invite`,
    body
  );

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await inviteUserApi(body);
    }
  }
  return data;
};

export const decentRoleApi = async (workspaceId, body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/workspace/decent-role/${workspaceId}`,
    body
  );

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await decentRoleApi(workspaceId, body);
    }
  }
  return data;
};

export const leaveWorkspaceApi = async (body) => {
  const { data } = await authorizedAxiosInstance.put(
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
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await cancelUserWorkspaceApi(body);
    }
  }
  return null;
};
/** Board */

export const getBoard = async (workspaceId) => {
  const { data } = await authorizedAxiosInstance.get(
    `/board?workspace_id=${workspaceId}`
  );
  return data;
};

export const getBoardDetail = async (boardId) => {
  const { data } = await authorizedAxiosInstance.get(`/board/${boardId}`);

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await getBoardDetail(boardId);
    }
  }
  return data;
};

export const createBoard = async (body) => {
  const { data } = await authorizedAxiosInstance.post(`/board`, body);

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createBoard(body);
    }
  }
  return data;
};

export const updateBoardDetail = async (boardId, updateData) => {
  const { data } = await authorizedAxiosInstance.put(
    `/board/${boardId}`,
    updateData
  );

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateBoardDetail(boardId, updateData);
    }
  }
  return data;
};

export const deleteBoard = async (boardId) => {
  const { data } = await authorizedAxiosInstance.delete(`/board/${boardId}`);

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteBoard(boardId);
    }
  }
  return data;
};

export const moveCardToDifferentColumnAPI = async (body) => {
  const { data } = await authorizedAxiosInstance.put(`/board/move-card`, body);

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await moveCardToDifferentColumnAPI(body);
    }
  }
  return data;
};

export const moveCardToDifferentBoardAPI = async (body) => {
  const { data } = await authorizedAxiosInstance.put(`/column/move-card`, body);

  return data;
};

/** Column */

export const createColumn = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/column`,
    body
  );

  if (response?.data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createColumn(body);
    }
  }

  return data;
};

export const updateColumnDetail = async (columnId, updateData) => {
  const { data, response } = await authorizedAxiosInstance.put(
    `/column/${columnId}`,
    updateData
  );

  if (response?.data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateColumnDetail(columnId, updateData);
    }
  }

  return data;
};

export const deleteColumn = async (columnId) => {
  const { response, data } = await authorizedAxiosInstance.delete(
    `/column/${columnId}`
  );

  if (response?.data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteColumn(columnId);
    }
  }
  return data;
};

export const moveColumnToDifferentBoardAPI = async (columnId, body) => {
  const { response, data } = await authorizedAxiosInstance.put(
    `/column/move-column/${columnId}`,
    body
  );
  return data;
};

export const copyColumnApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/column/copy-column`,
    body
  );

  if (response?.data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await copyColumnApi(body);
    }
  }
  return data;
};

/** Card */
export const createCard = async (body) => {
  const { data } = await authorizedAxiosInstance.post(`/card`, body);

  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createCard(body);
    }
  }
  return data;
};

export const getCardDetail = async (cardId) => {
  const { response, data } = await authorizedAxiosInstance.get(
    `/card/${cardId}`
  );
  return data;
};

export const updateCardApi = async (cardId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/card/${cardId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateCardApi(cardId, body);
    }
  }
  return null;
};

export const DateCardApi = async (cardId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/card/date-card/${cardId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await DateCardApi(cardId, body);
    }
  }
  return null;
};

export const assignUserApi = async (cardId, body) => {
  const access_token = Cookies.get("access_token");
  const { response, data } = await client.post(
    `/card/assign-user/${cardId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await assignUserApi(cardId, body);
    }
  }
  return null;
};

export const unAssignUserApi = async (cardId, body) => {
  const access_token = Cookies.get("access_token");
  const { response, data } = await client.put(
    `/card/un-assign-user/${cardId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await unAssignUserApi(cardId, body);
    }
  }
  return null;
};

export const copyCardWithBoardApi = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(
    `/card/copy-card`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await copyCardWithBoardApi(body);
    }
  }
  return null;
};

export const deleteCardApi = async (cardId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/card/${cardId}`,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteCardApi(cardId);
    }
  }
  return null;
};
/** Work */
export const createWorkApi = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(`/work`, body, access_token);
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createWorkApi(body);
    }
  }
  return null;
};

export const updateWorkApi = async (workId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/work/${workId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateWorkApi(workId, body);
    }
  }
  return null;
};

export const deleteWorkApi = async (workId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/work/${workId}`,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteWorkApi(workId);
    }
  }
  return null;
};

/** Mission */

export const getMissionsApi = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await client.get(`/mission?${queryString}`);
  return data;
};
export const createMissionApi = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(`/mission`, body, access_token);
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createMissionApi(body);
    }
  }
  return null;
};

export const updateMissionApi = async (missionId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/mission/${missionId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateMissionApi(missionId, body);
    }
  }
  return null;
};

export const deleteMissionApi = async (missionId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/mission/${missionId}`,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteMissionApi(missionId);
    }
  }
  return null;
};

export const transferCardApi = async (missionId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(
    `/mission/transfer-card/${missionId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await transferCardApi(missionId, body);
    }
  }
  return null;
};
/** Attachment */

export const attachmentFileApi = async (cardId, formData) => {
  const access_token = Cookies.get("access_token");

  const result = await fetch(
    `http://localhost:3001/api/v1/card/uploads-file/${cardId}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await result.json(); // Lấy dữ liệu từ kết quả fetch

  if (result.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await attachmentFileApi(cardId, formData);
    }
  }
  return null;
};
export const downloadFileApi = async (attachmentId) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/api/v1/attachment/download/${attachmentId}`,
      { responseType: "blob" }
    );
    const blob = new Blob([res.data], { type: res.data.type });
    console.log(blob);
    // const link = document.createElement("a");
    // link.href = window.URL.createObjectURL(blob);
    // link.download = `${blob.fileName}`;
    // link.download = res.headers["content-disposition"].split("filename=")[1];
    // link.click();
  } catch (error) {
    console.log(error);
  }
};

export const updateFileApi = async (attachmentId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/attachment/${attachmentId}`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateFileApi(attachmentId, body);
    }
  }
  return null;
};

export const deleteFileApi = async (attachmentId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/attachment/${attachmentId}`,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data?.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteFileApi(attachmentId);
    }
  }
  return null;
};
/* Notification */
export const markAsReadNotification = async (body) => {
  const { response, data } = await client.put(
    `/notification/mark-as-read`,
    body
  );
  if (response.ok) {
    return data;
  }
};
export const clickNotification = async (body) => {
  const { response, data } = await client.put(
    `/notification/click-notify`,
    body
  );
  if (response.ok) {
    return data;
  }
};
