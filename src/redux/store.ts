import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import carsReducer from "./slices/carsSlice";
import searchesReducer from "./slices/searchesSlice";

const persistConfig = {
  key: "root",
  storage,
  // Ambos se persisten: filtros/favoritos y las búsquedas recientes.
  whitelist: ["cars", "searches"],
};

const rootReducer = combineReducers({
  cars: carsReducer,
  searches: searchesReducer,
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
