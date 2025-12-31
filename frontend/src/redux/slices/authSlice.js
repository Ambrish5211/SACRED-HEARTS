import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  watchList: [],
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const response = axiosInstance.post("/users/register", data);
    toast.promise(response, {
      loading: "Wait! Creating your account",
      success: "Account created successfully",
      error: "Failed to create your account",
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.errors);
  }
});

export const login = createAsyncThunk("/auth/signin", async (data) => {
  try {
    const response = axiosInstance.post("/users/login/", data);
    toast.promise(response, {
      loading: "Wait! Authenticating your account",
      success: "User loggedIn Successsfully",
      error: "Failed to authenticate your account",
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const addToWatchList = createAsyncThunk("/auth/addToWatchList", async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movies/addToWatchList/${movieId}`);
    toast.success("Added to watchlist");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to add to watchlist");
  }
});

export const removeFromWatchList = createAsyncThunk("/auth/removeFromWatchList", async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movies/removeFromWatchList/${movieId}`);
    toast.success("Removed from watchlist");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to remove from watchlist");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.watchList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          state.isLoggedIn = true;
          state.isAdmin = action.payload.data.user.isAdmin;
          state.watchList = action.payload.data.user.watchList || [];
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          state.isLoggedIn = true;
          state.isAdmin = action.payload.data.user.isAdmin;
          state.watchList = action.payload.data.user.watchList || [];
        }
      })
      .addCase(addToWatchList.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          if (action?.payload?.data?.user) {
            state.watchList = action.payload.data.user.watchList;
          } else {
            const movieId = action.meta.arg;
            const exists = state.watchList.some(m => m === movieId || m._id === movieId);
            if (!exists) {
              state.watchList.push(movieId);
            }
          }
        }
      })
      .addCase(removeFromWatchList.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          if (action?.payload?.data?.user) {
            state.watchList = action.payload.data.user.watchList;
          } else {
            const movieId = action.meta.arg;
            state.watchList = state.watchList.filter(m => m !== movieId && m._id !== movieId);
          }
        }
      });
  },
});

export default authSlice.reducer;

export const { logoutSuccess } = authSlice.actions;
