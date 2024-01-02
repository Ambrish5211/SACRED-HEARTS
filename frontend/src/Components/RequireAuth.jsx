import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? <Outlet /> : <Navigate to="login" />;
}

export default RequireAuth;
