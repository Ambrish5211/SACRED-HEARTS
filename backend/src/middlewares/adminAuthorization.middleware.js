import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!isAdmin) {
        throw new ApiError(403, "Access Denied, Admin only")
    }
    next()
}