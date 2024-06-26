import { configureStore } from "@reduxjs/toolkit";
import { workspaceSlice } from "./slices/workspaceSlice";
import { userSlice } from "./slices/userSlice";
import { providerSlice } from "./slices/providerSlice";
import { deviceSlice } from "./slices/deviceSlice";
import { cardSlice } from "./slices/cardSlice";
import { boardSlice } from "./slices/boardSlice";
import { columnSlice } from "./slices/columnSlice";
import { missionSlice } from "./slices/missionSlice";
import { socketSlice } from "./slices/socket";
import { notificationSlice } from "./slices/notificationSlice";
import { myWorkspacesSlice } from "./slices/myWorkspacesSlice";
export const store = configureStore({
  reducer: {
    my_workspaces: myWorkspacesSlice.reducer,
    workspace: workspaceSlice.reducer,
    user: userSlice.reducer,
    provider: providerSlice.reducer,
    device: deviceSlice.reducer,
    card: cardSlice.reducer,
    board: boardSlice.reducer,
    column: columnSlice.reducer,
    mission: missionSlice.reducer,
    socket: socketSlice.reducer,
    notification: notificationSlice.reducer,
  },
});
