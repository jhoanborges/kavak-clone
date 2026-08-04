"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import PersistLoader from "@/components/ui/PersistLoader";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
