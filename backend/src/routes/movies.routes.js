import { Router } from "express";
import {  addMovie, movieDescription, moviesList } from "../controllers/movie.controller";

const router = Router();

router.route("/movieList").get(moviesList);
router.route("/addMovie").post(addMovie);
router.route("/movie-description").get(movieDescription);   


export default router;