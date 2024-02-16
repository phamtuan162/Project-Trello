"use client";
import { Provider } from "react-redux";
import { store } from "./store";
function ProviderRedux({ children }) {
  console.log(store);
  return <Provider store={store}>{children}</Provider>;
}

export default ProviderRedux;
