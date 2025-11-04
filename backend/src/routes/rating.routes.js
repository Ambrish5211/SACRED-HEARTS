import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addRating } from "../controllers/rating.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addRating)

export default router;