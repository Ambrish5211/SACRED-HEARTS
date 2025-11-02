import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminAuthorization.middleware.js";
import { addGenre, genreList, updateGenre } from "../controllers/genre.controller.js";

const router = Router();


router.route("/add-genre").post(verifyJWT, isAdmin, addGenre)
router.route("/genre-list").get(verifyJWT, isAdmin, genreList)
router.route("/update-genre/:genreId").patch(verifyJWT, isAdmin, updateGenre)

export default router