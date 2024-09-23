import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" ? true : false,
  isAdmin: localStorage.getItem("isAdmin") === "true" ? true : false,
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const response = await axiosInstance.post("/users/register", data);
    console.log(response);
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
      // Reset isLoggedIn state to false
      state.isLoggedIn = false;
      state.isAdmin = false;
      // Clear the value from local storage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("isAdmin", true);
        state.isLoggedIn = true;
        state.isAdmin = action.payload.data.user.isAdmin;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        // console.log(action.payload.data.user.isAdmin);
        localStorage.setItem("isAdmin", true);
        state.isLoggedIn = true;
        state.isAdmin = true;
      });
  },
});

export default authSlice.reducer;

export const { logoutSuccess } = authSlice.actions;
