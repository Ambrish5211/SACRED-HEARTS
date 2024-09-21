import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      
    },
    genre:{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);


export const Movie = moongose.Model("Movie", movieSchema);