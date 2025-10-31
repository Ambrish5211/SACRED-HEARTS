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
      required: true
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
    genreId:[
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
      }
    ],
    genreName: [{
      type: String
    }],
    avgRating:{
      type: Number,
      required: true,
    },
    totalRatings:{
      type: Number,
      required: true
    },
    totalRatingValue: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

movieSchema.plugin(mongooseAggregatePaginate)

export const Movie = mongoose.model("Movie", movieSchema);