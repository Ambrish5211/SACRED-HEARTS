import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    genres: [],
    loading: false,
    error: null
};

// Async thunk to fetch genres
export const getAllGenres = createAsyncThunk("/genre/getAll", async () => {
    try {
        const response = await axiosInstance.get("/genre/genre-list");
        console.log(response.data);
        return response.data;
    } catch (error) {
        // toast.error(error?.response?.data?.message || "Failed to load genres");
        console.log(error); // Log error instead of toasting on auto-fetch
        throw error;
    }
});

const genreSlice = createSlice({
    name: "genre",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllGenres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllGenres.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action);
                if (action.payload?.success) {
                    state.genres = action.payload?.data || [];
                }
            })
            .addCase(getAllGenres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default genreSlice.reducer;
