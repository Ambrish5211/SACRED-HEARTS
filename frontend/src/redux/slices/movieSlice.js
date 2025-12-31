import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../config/axiosInstance";

const initialState = {
  movieList: [],
  currentMovie: null,
};

export const getAllMovies = createAsyncThunk(
  "/movies/getAllMovies",
  async (data) => {
    try {
      const response = axiosInstance.get("/movies/movie-list", data);
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

export const getMovieById = createAsyncThunk(
  "/movies/getMovieById",
  async (id) => {
    try {
      const response = await axiosInstance.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
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

      if (action?.payload?.data) {
        state.movieList = [...action.payload.data.moviesList];
      }
    });
    builder.addCase(getMovieById.fulfilled, (state, action) => {
      if (action?.payload?.success) {
        state.currentMovie = action.payload.data;
      }
    });
  },
});

export default movieSlice.reducer;
