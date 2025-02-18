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
      const response =  axiosInstance.get("/movies/movieList", data);
      // console.log(response);
      toast.promise(response, {
        loading: "Wait! Fetching all movies",
        success: "Success",
        error: "Failed to load your movies",
      });
      return (await response).data;
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);
    }
  },
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMovies.fulfilled, (state, action) => {
      
      if (true) {
        state.movieList = [...action.payload.data.moviesList];
      }
    });
  },
});

export default movieSlice.reducer;
