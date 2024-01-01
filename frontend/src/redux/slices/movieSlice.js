import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  movieList: [],
};

export const getAllMovies = createAsyncThunk(
  "/movies/getAllMovies",
  async (data) => {
    try {
      const response = axiosInstance.get("/movies", data);
      toast.promise(response, {
        loading: "Wait! Fetching all courses",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to load your courses",
      });
      return (await response).data.courses;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      if (action?.payload) {
        state.courseList = [...action.payload];
      }
    });
  },
});

export default movieSlice.reducer;
