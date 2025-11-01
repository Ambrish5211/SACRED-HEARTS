import { ApiError } from "../utils/apiError";

export  const isAdmin = (req, res, next) =>{
    const user = req.user;
    if(user.role != "ADMIN"){
        throw new ApiError(403, "Access Denied, Admin only")
    }
    next()
}