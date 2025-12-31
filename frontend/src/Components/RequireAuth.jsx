import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#141414]">
        <span className="loading loading-spinner loading-lg text-yellow-500"></span>
      </div>
    );
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default RequireAuth;
