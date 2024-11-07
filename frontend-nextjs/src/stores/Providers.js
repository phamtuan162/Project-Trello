"use client";
import { Provider } from "react-redux";
import { store } from "./store";

// Cấu hình redux-persist
// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";
// const persistor = persistStore(store);

// Kỹ thuật Inject Store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from "@/utils/authorizedAxios";
injectStore(store);

function ProviderRedux({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
// <PersistGate persistor={persistor}>{children}</PersistGate>

export default ProviderRedux;
