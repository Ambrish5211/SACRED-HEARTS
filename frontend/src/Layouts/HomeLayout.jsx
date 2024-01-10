import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../redux/slices/authSlice";
import Footer from "../Components/Footer";

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isAdmin = useSelector((state) => state?.auth?.isAdmin);
  const role = useSelector((state) => state?.auth?.role);

  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "0";
  }

  async function onLogout(e) {
    e.preventDefault();

    dispatch(logoutSuccess());
    if (response?.payload?.data) navigate("/");
  }

  return (
    <div className="min-h-screen">
      <div className="drawer absolute  left-0 z-50 w-full">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer">
            <FiMenu
              onClick={changeWidth}
              size={"32px"}
              className="text-gray m-4 transform cursor-pointer font-bold transition duration-300 ease-in-out hover:scale-105"
            />
          </label>
        </div>
        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu relative h-[100%] w-48 bg-base-200 p-4 text-base-content sm:w-80">
            <li className="absolute right-2 z-50 w-fit">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>
            <li>
              <Link to="/"> Home </Link>
            </li>
            <li>
              <Link to="/about"> About us </Link>
            </li>
            <li>
              <Link to="/contact"> Contact us </Link>
            </li>
            <li>
              <Link to="/movies"> All movies </Link>
            </li>

            {!isLoggedIn ? (
              <li className="absolute bottom-4 w-[90%]">
                <div className="flex w-full items-center justify-center">
                  <button className="btn-primary w-full rounded-md bg-red-600 px-4 py-1 font-semibold ">
                    <Link to="/login">Login</Link>
                  </button>
                  <button className="btn-secondary w-full rounded-md bg-blue-800 px-4 py-1 font-semibold">
                    <Link to="/register">Signup</Link>
                  </button>
                </div>
              </li>
            ) : (
              <li className="absolute bottom-4 w-[90%]">
                <div className="flex w-full items-center justify-center">
                  {isAdmin ? (
                    <button className="btn-primary w-full rounded-md bg-red-600 px-4 py-1  font-semibold">
                      <Link to="https://movie-downloader-backend.onrender.com/admin">
                        Admin
                      </Link>
                    </button>
                  ) : (
                    ""
                  )}

                  <button className="btn-secondary w-full rounded-md bg-blue-800 px-4 py-1  font-semibold">
                    <Link onClick={onLogout}>Logout</Link>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {children}
    </div>
  );
}

export default HomeLayout;
