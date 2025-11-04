import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const movieSchema = new Schema(
  {
    owner: {
      type : Schema.Types.ObjectId,
      ref : "User"
    },
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
    year: {
      type: Number,
      required: true
    },
    languages: [
      {
        type: String,
        required: true
      }
    ],
    genres:[
      {
        type: Schema.Types.ObjectId, ref: "Genre",
      }
    ],
  },
  { timestamps: true }
);

movieSchema.plugin(mongooseAggregatePaginate)

export const Movie = mongoose.model("Movie", movieSchema);