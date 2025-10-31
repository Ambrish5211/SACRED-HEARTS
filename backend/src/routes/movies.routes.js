import { Router } from "express";
import {  addMovie, movieById, moviesList, topRatedMovies } from "../controllers/movie.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/top-rated-movies").get(topRatedMovies);
router.route("/movieList").get(moviesList);

// protected routes
router.route("/movie-by-id/:id").get(verifyJWT, movieById);
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
   


export default router;