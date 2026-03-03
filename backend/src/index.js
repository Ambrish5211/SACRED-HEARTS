import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error after db connection: ", error);
      throw error;
    });

    // Bind port immediately so Render detects it
    app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
      console.log("Server is listening on PORT", process.env.PORT || 4000);

      // Start worker in background — does NOT block port binding
      import("./worker/movieWorker.js")
        .then(() => console.log("[Worker] Movie worker started successfully."))
        .catch((err) => console.error("[Worker] Failed to start worker:", err.message));
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED", err);
  });
