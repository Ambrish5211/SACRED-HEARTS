import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import genreReducer from "./slices/genreSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    genre: genreReducer,
  },
  devTools: true,
});

export default store;
