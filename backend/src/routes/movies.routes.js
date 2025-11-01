import { Router } from "express";
import {  addMovie, deleteMovie, movieById, moviesList, topRatedMovies } from "../controllers/movie.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminAuthorization.middleware.js";

const router = Router();

router.route("/top-rated-movies").get(topRatedMovies);
router.route("/movieList").get(moviesList);

// protected routes
router.route("/:id").get(verifyJWT, movieById);
router.route("/addMovie").post( upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
    
]),verifyJWT, isAdmin, addMovie);
router.route("/delete/:id").delete(verifyJWT, isAdmin, deleteMovie);
   


export default router;