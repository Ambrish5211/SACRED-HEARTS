import mongoose, {Mongoose, Schema} from "mongoose";

const genreSchema = new Schema(
    {
        name: {
            type: String, 
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Genre = mongoose.Model("Genre", genreSchema);