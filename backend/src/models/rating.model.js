import mongoose, {Schema} from "mongoose";


const ratingSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true
        },
        movieId: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true
        },
    },
    {
        timestamps: true
    }
    );

    // index to make sure one user can rate a movie only once
    ratingSchema.index({ userId: 1, movieId: 1}, {unique: true});

    export const Rating = mongoose.model("Rating", ratingSchema);