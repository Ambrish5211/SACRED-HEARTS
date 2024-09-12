import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
  path: "./.env",
});



connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error after db connection: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is listening on PORT", process.env.PORT || 4000);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED", err);
  });