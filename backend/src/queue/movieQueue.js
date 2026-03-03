import { Queue } from 'bullmq'
import redis from "../config/redis.js";


const movieQueue = new Queue("video-upload", {
    connection: redis
})

export default movieQueue;