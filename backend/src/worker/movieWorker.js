import { Worker } from "bullmq";
import { workerRedis } from "../config/redis.js";
import connectDB from "../db/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Movie } from "../models/movie.model.js";

// Connect to MongoDB
await connectDB();

const movieWorker = new Worker("video-upload", async (job) => {
    try {
        const { movieId, thumbnailServerPath, movieServerPath } = job.data;
        console.log(`[Worker] Processing movie ${movieId}`);

        const thumbnailUpload = await uploadOnCloudinary(thumbnailServerPath);
        const movieUpload = await uploadOnCloudinary(movieServerPath);

        if (thumbnailUpload && movieUpload) {
            const durationInMinutes = movieUpload.duration ? (movieUpload.duration / 60) : 0;

            await Movie.findByIdAndUpdate(movieId, {
                thumbnail: thumbnailUpload.url,
                videoFile: movieUpload.url,
                duration: durationInMinutes,
            });
            console.log(`[Worker] Movie ${movieId} processed and uploaded successfully.`);
        } else {
            console.error(`[Worker] Failed to upload files to Cloudinary for movie ${movieId}`);
        }
    } catch (error) {
        console.error(`[Worker] Error processing job: ${error.message}`);
    }
}, { connection: workerRedis });

movieWorker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed.`);
});

movieWorker.on("failed", async (job, err) => {
    console.error(`[Worker] Job ${job.id} failed: ${err.message}`);
    if (job.attemptsMade === job.opts.attempts) {
        await Movie.findByIdAndDelete(job.data.movieId);
        console.log(`[Worker] Deleted movie ${job.data.movieId} after all retries failed.`);
    }
});

export default movieWorker;