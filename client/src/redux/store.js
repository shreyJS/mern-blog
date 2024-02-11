import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

// combined all reducers using combineReducers
const rootReducer = combineReducers({
  user: userReducer,
});

// config object needed to persist a reducer
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// making rootReducer persist using persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// passing single persisted root reducer and adding middleware fn
// getDefaultMiddleware() is fn which adds all default middleware fns in addition to our added fns
// otherwise, if we add any midware fn, we need to add ALL default midware fns also
// to exclude any specific midware fn, pass false to its corresponding value

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// exporting persisted Store
export const persistor = persistStore(store);
