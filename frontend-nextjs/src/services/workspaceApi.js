// import axios from "axios";
// import { API_ROOT } from "@/utils/constants";
import { client } from "@/services/clientUtils";
import { getAccessToken } from "./authApi";
import Cookies from "js-cookie";
import axios from "axios";
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
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await getWorkspaceDetail(workspaceId);
    }
  }
  return null;
};
export const searchWorkspace = async (userId) => {
  const { response, data } = await client.get(`/workspace?user_id=${userId}`);
  if (response.ok) {
    return data.data;
  }
};

export const restoreWorkspaceApi = async (workspaceId) => {
  const { response, data } = await client.put(
    `/workspace/restore/${workspaceId}`
  );
  if (response.ok) {
    return data;
  }
};

export const switchWorkspace = async (workspaceId, body) => {
  const { response, data } = await client.put(
    `/workspace/change-workspace/${workspaceId}`,
    body
  );
  if (response.ok) {
    return data;
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
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateWorkspaceApi(workspaceId, body);
    }
  }
  return null;
};

export const deleteWorkspaceApi = async (workspaceId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/workspace/${workspaceId}`,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteWorkspaceApi(workspaceId);
    }
  }
  return null;
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
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await inviteUserApi(body);
    }
  }
  return null;
};

export const decentRoleApi = async (workspaceId, body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/workspace/decent-role/${workspaceId}`,
    body,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await decentRoleApi(workspaceId, body);
    }
  }
  return null;
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
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await cancelUserWorkspaceApi(body);
    }
  }
  return null;
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

  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await getBoardDetail(boardId);
    }
  }
  return data;
};

export const createBoard = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(`/board`, body, access_token);
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createBoard(body);
    }
  }
  return null;
};

export const updateBoardDetail = async (boardId, updateData) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/board/${boardId}`,
    updateData,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateBoardDetail(boardId, updateData);
    }
  }
  return null;
};

export const deleteBoard = async (boardId) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.delete(
    `/board/${boardId}`,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteBoard(boardId);
    }
  }
  return null;
};

export const moveCardToDifferentColumnAPI = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/board/move-card`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await moveCardToDifferentColumnAPI(body);
    }
  }
  return null;
};

export const moveCardToDifferentBoardAPI = async (body) => {
  const { response, data } = await client.put(`/column/move-card`, body);
  if (response.ok) {
    return data;
  }
};

/** Column */

export const createColumn = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(`/column`, body, access_token);
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createColumn(body);
    }
  }
  return null;
};

export const updateColumnDetail = async (columnId, updateData) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.put(
    `/column/${columnId}`,
    updateData,
    access_token
  );

  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await updateColumnDetail(columnId, updateData);
    }
  }
  return null;
};

export const deleteColumn = async (columnId) => {
  const access_token = Cookies.get("access_token");
  const { response, data } = await client.delete(
    `/column/${columnId}`,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await deleteColumn(columnId);
    }
  }
  return null;
};

export const moveColumnToDifferentBoardAPI = async (columnId, body) => {
  const { response, data } = await client.put(
    `/column/move-column/${columnId}`,
    body
  );
  if (response.ok) {
    return data;
  }
};

export const copyColumnApi = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(
    `/column/copy-column`,
    body,
    access_token
  );
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await copyColumnApi(body);
    }
  }
  return null;
};

/** Card */
export const createCard = async (body) => {
  const access_token = Cookies.get("access_token");

  const { response, data } = await client.post(`/card`, body, access_token);
  if (response.ok || data.error) {
    return data;
  }
  if (data.status === 401) {
    const newAccessToken = await getAccessToken();
    if (newAccessToken) {
      return await createCard(body);
    }
  }
  return null;
};

export const getCardDetail = async (cardId) => {
  const { response, data } = await client.get(`/card/${cardId}`);
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
  if (data.status === 401) {
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
