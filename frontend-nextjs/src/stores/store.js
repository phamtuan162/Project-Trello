import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
// import { persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { workspaceSlice } from "./slices/workspaceSlice";
import { userSlice } from "./slices/userSlice";
import { cardSlice } from "./slices/cardSlice";
import { boardSlice } from "./slices/boardSlice";
import { missionSlice } from "./slices/missionSlice";
import { notificationSlice } from "./slices/notificationSlice";
import { myWorkspacesSlice } from "./slices/myWorkspacesSlice";

// const persistConfig = {
//   key: "root",
//   storage: storage, // Chỉ sử dụng localStorage khi ở phía client
//   whitelist: [""],
//   // blacklist: ["user"],
// };

// const reducers = combineReducers({
//   my_workspaces: myWorkspacesSlice.reducer,
//   workspace: workspaceSlice.reducer,
//   user: userSlice.reducer,
//   card: cardSlice.reducer,
//   board: boardSlice.reducer,
//   mission: missionSlice.reducer,
//   notification: notificationSlice.reducer,
// });

// const persistReducers = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//   reducer: persistReducers,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

export const store = configureStore({
  reducer: {
    my_workspaces: myWorkspacesSlice.reducer,
    workspace: workspaceSlice.reducer,
    user: userSlice.reducer,
    card: cardSlice.reducer,
    board: boardSlice.reducer,
    mission: missionSlice.reducer,
    notification: notificationSlice.reducer,
  },
});
