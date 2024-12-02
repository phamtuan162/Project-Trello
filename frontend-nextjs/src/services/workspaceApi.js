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
//   const { response, data } = await authorizedAxiosInstance.get(`/workspace?${queryString}`);
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

export const switchWorkspaceApi = async (workspaceId, body) => {
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

  return data;
};

export const deleteWorkspaceApi = async (workspaceId) => {
  const { data } = await authorizedAxiosInstance.delete(
    `/workspace/${workspaceId}`
  );

  return data;
};

export const inviteUserApi = async (body) => {
  const { data } = await authorizedAxiosInstance.post(
    `/workspace/invite`,
    body
  );

  return data;
};

export const decentRoleApi = async (workspaceId, body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/workspace/decent-role/${workspaceId}`,
    body
  );

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
  const { response, data } = await authorizedAxiosInstance.put(
    `/workspace/cancel-user`,
    body
  );

  return data;
};
/** Board */

export const getBoard = async (workspaceId) => {
  const { data } = await authorizedAxiosInstance.get(
    `/board?workspace_id=${workspaceId}`
  );
  return data;
};

export const getBoardDetail = async (boardId, query = {}) => {
  const queryString = new URLSearchParams(query).toString();

  const { data } = await authorizedAxiosInstance.get(
    `/board/${boardId}?${queryString}`
  );

  return data;
};

export const createBoard = async (body) => {
  const { data } = await authorizedAxiosInstance.post(`/board`, body);

  return data;
};

export const updateBoardDetail = async (boardId, updateData) => {
  const { data } = await authorizedAxiosInstance.put(
    `/board/${boardId}`,
    updateData
  );

  return data;
};

export const deleteBoard = async (boardId) => {
  const { data } = await authorizedAxiosInstance.delete(`/board/${boardId}`);

  return data;
};

export const moveCardToDifferentColumnAPI = async (body) => {
  const { data } = await authorizedAxiosInstance.put(`/board/move-card`, body);

  return data;
};

export const moveCardToDifferentBoardAPI = async (body) => {
  const { data } = await authorizedAxiosInstance.put(`/column/move-card`, body);

  return data;
};

/** Column */

export const createColumnApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/column`,
    body
  );

  return data;
};

export const updateColumnDetail = async (columnId, updateData) => {
  const { data, response } = await authorizedAxiosInstance.put(
    `/column/${columnId}`,
    updateData
  );

  return data;
};

export const deleteColumn = async (columnId) => {
  const { response, data } = await authorizedAxiosInstance.delete(
    `/column/${columnId}`
  );

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

  return data;
};

/** Card */
export const createCard = async (body) => {
  const { data } = await authorizedAxiosInstance.post(`/card`, body);

  return data;
};

export const getCardDetail = async (cardId) => {
  const { data } = await authorizedAxiosInstance.get(`/card/${cardId}`);
  return data;
};

export const updateCardApi = async (cardId, body) => {
  const { data } = await authorizedAxiosInstance.put(`/card/${cardId}`, body);
  return data;
};

export const DateCardApi = async (cardId, body) => {
  const { response, data } = await authorizedAxiosInstance.put(
    `/card/date-card/${cardId}`,
    body
  );
  return data;
};

export const assignUserApi = async (cardId, body) => {
  const { data } = await authorizedAxiosInstance.post(
    `/card/assign-user/${cardId}`,
    body
  );
  return data;
};

export const unAssignUserApi = async (cardId, body) => {
  const { data } = await authorizedAxiosInstance.put(
    `/card/un-assign-user/${cardId}`,
    body
  );
  return data;
};

export const copyCardWithBoardApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/card/copy-card`,
    body
  );
  return data;
};

export const deleteCardApi = async (cardId) => {
  const { response, data } = await authorizedAxiosInstance.delete(
    `/card/${cardId}`
  );
  return data;
};
/** Work */
export const createWorkApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(`/work`, body);
  return data;
};

export const updateWorkApi = async (workId, body) => {
  const { response, data } = await authorizedAxiosInstance.put(
    `/work/${workId}`,
    body
  );
  return data;
};

export const deleteWorkApi = async (workId) => {
  const { response, data } = await authorizedAxiosInstance.delete(
    `/work/${workId}`
  );
  return data;
};

/** Mission */

export const getMissionsApi = async (query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const { response, data } = await authorizedAxiosInstance.get(
    `/mission?${queryString}`
  );
  return data;
};

export const createMissionApi = async (body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/mission`,
    body
  );
  return data;
};

export const updateMissionApi = async (missionId, body) => {
  const { response, data } = await authorizedAxiosInstance.put(
    `/mission/${missionId}`,
    body
  );
  return data;
};

export const deleteMissionApi = async (missionId) => {
  const { response, data } = await authorizedAxiosInstance.delete(
    `/mission/${missionId}`
  );
  return data;
};

export const transferCardApi = async (missionId, body) => {
  const { response, data } = await authorizedAxiosInstance.post(
    `/mission/transfer-card/${missionId}`,
    body
  );
  return data;
};
/** Attachment */

export const attachmentFileApi = async (cardId, formData) => {
  const { data } = await authorizedAxiosInstance.post(
    `/card/uploads-file/${cardId}`,
    formData
  );
  return data;
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
  const { response, data } = await authorizedAxiosInstance.put(
    `/attachment/${attachmentId}`,
    body
  );
  return data;
};

export const deleteFileApi = async (attachmentId) => {
  const { response, data } = await authorizedAxiosInstance.delete(
    `/attachment/${attachmentId}`
  );
  return data;
};
