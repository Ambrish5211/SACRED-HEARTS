import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  watchList: [],
  loading: true, // Start loading to wait for getUser
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

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const response = axiosInstance.post("/users/logout");
    toast.promise(response, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out",
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const getUser = createAsyncThunk("/auth/me", async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error) {
    // Do not toast error here as it runs on every load for logged out users too usually, 
    // or effectively silent fail if not logged in.
    // But if user expects it to restore session, maybe log error.
    console.log(error);
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
  reducers: {},
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
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.isAdmin = false;
        state.watchList = [];
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
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.success) {
          state.isLoggedIn = true;
          state.isAdmin = action.payload.user?.isAdmin || false;
          state.watchList = action.payload.user?.watchList || [];
        }
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;

export const { logoutSuccess } = authSlice.actions;
