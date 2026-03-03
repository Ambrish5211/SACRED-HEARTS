import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(async () => {
    app.on("error", (error) => {
      console.log("Error after db connection: ", error);
      throw error;
    });

    // Start worker after DB is connected
    try {
      await import("./worker/movieWorker.js");
      console.log("[Worker] Movie worker started successfully.");
    } catch (err) {
      console.error("[Worker] Failed to start worker:", err.message);
    }

    app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
      console.log("Server is listening on PORT", process.env.PORT || 4000);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED", err);
  });
