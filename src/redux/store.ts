import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import carsReducer from "./slices/carsSlice";
import searchesReducer from "./slices/searchesSlice";
import agendarReducer from "./slices/agendarSlice";

const persistConfig = {
  key: "root",
  storage,
  // Ambos se persisten: filtros/favoritos y las búsquedas recientes.
  // El código OTP NO se persiste: vive en el estado local del flujo.
  whitelist: ["cars", "searches", "agendar"],
};

const rootReducer = combineReducers({
  cars: carsReducer,
  searches: searchesReducer,
  agendar: agendarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
