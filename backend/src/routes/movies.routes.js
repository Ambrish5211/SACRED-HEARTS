import { Router } from "express";
import {  addMovie, movieDescription, moviesList } from "../controllers/movie.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/movieList").get(moviesList);
router.route("/addMovie").post( upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
    
]),addMovie);
router.route("/movie-description").get(movieDescription);   


export default router;