import axios from "axios";
import { API_ROOT } from "@/utils/constants";
// const config = {
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//   },
// };

/** Workspace */
export const getWorkspace = async () => {
  const response = await axios.get(`${API_ROOT}/workspace`);
  return response.data;
};
export const getWorkspaceDetail = async (workspaceId) => {
  const response = await axios.get(`${API_ROOT}/workspace/${workspaceId}`);
  return response.data;
};

/** Board */

export const getBoard = async (workspaceId) => {
  const response = await axios.get(
    `${API_ROOT}/board?workspace_id=${workspaceId}`
  );
  return response.data;
};

export const getBoardDetail = async (boardId) => {
  console.log(boardId);
  const response = await axios.get(`${API_ROOT}/board/${boardId}`);
  return response.data;
};

export const createBoard = async (body) => {
  const response = await axios.post(`${API_ROOT}/board`, body);
  return response.data;
};

export const updateBoardDetail = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/board/${boardId}`, updateData);
  return response.data;
};

export const deleteBoard = async (boardId) => {
  const response = await axios.delete(`${API_ROOT}/board/${boardId}`);
  return response.data;
};

export const moveCardToDifferentColumnAPI = async (boardId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/board/move-card/${boardId}`,
    updateData
  );
  return response.data;
};

/** Column */

export const createColumn = async (body) => {
  const response = await axios.post(`${API_ROOT}/column`, body);
  return response.data;
};

export const updateColumnDetail = async (columnId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/column/${columnId}`,
    updateData
  );
  return response.data;
};

export const deleteColumn = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/column/${columnId}`);
  return response.data;
};

/** Card */
export const createCard = async (body) => {
  const response = await axios.post(`${API_ROOT}/card`, body);
  return response.data;
};
