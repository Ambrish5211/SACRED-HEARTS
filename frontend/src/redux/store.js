import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
  },
  devTools: true,
});

export default store;
