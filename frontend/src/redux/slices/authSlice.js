import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  isLoggedIn:  false,
  isAdmin: false,
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const response =  axiosInstance.post("/users/register", data);
    toast.promise(response, {
      loading: "Wait! Creating your account",
      success: "Account created successfully",
      error: "Failed to create your account",
    });
    return await response;
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
    return await response;
  } catch (error) {
    toast.error(error?.response?.errors);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      
      state.isLoggedIn = false;
      state.isAdmin = false;
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isAdmin = action.payload.data.data.isAdmin;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isAdmin = action.payload.data.data.user.isAdmin;
      });
  },
});

export default authSlice.reducer;

export const { logoutSuccess } = authSlice.actions;
