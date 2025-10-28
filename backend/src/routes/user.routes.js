import {Router} from "express";
import { getUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router  =  Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured Routes
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJWT, getUser)

export default router;