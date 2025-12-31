import { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { getAllGenres } from "../redux/slices/genreSlice";
import Footer from "../Components/Footer/Footer";
import SearchBar from "../Components/SearchBar";

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hideSearch = location.pathname.startsWith("/movies/description") || location.pathname === "/login" || location.pathname === "/register";

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isAdmin = useSelector((state) => state?.auth?.isAdmin);
  const { genres } = useSelector((state) => state.genre) || { genres: [] };

  useEffect(() => {
    // Fetch genres if not already loaded (optional check, but good for perf)
    if (!genres || genres.length === 0) {
      dispatch(getAllGenres());
    }
  }, [dispatch, genres?.length]);

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

    const response = await dispatch(logout());
    if (response) navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <div className="drawer absolute left-0 z-50 w-full pt-3">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center justify-between px-4 py-2 relative z-50"> {/* Navbar */}
          <label htmlFor="my-drawer">
            <FiMenu
              onClick={changeWidth}
              size={"32px"}
              className="text-white cursor-pointer hover:text-accent transition duration-300"
            />
          </label>

          {/* Search and Filter Section */}
          {!hideSearch && (
            <div className="flex items-center gap-4">
              <SearchBar />
            </div>
          )}
        </div>

        <div className="drawer-side w-0 z-50">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu h-[100%] w-48 bg-base-200 p-4 text-base-content sm:w-80">
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>
            <li>
              <Link to="/"> Home </Link>
            </li>
            <li>
              <Link to="/movies"> All Movies </Link>
            </li>

            {isLoggedIn && (
              <li>
                <Link to="/user/watchlist"> Watchlist </Link>
              </li>
            )}

            {isLoggedIn && isAdmin && (
              <li>
                <Link to="/admin/addmovie"> Add Movie </Link>
              </li>
            )}

            {isLoggedIn && isAdmin && (
              <li>
                <Link to="/admin/addgenre"> Add Genre </Link>
              </li>
            )}

            {!isLoggedIn ? (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button className="btn-primary px-4 py-1 font-semibold rounded-md w-full bg-red-600 ">
                    <Link to="/login">Login</Link>
                  </button>
                  <button className="btn-secondary px-4 py-1 font-semibold rounded-md w-full bg-blue-800">
                    <Link to="/register">Signup</Link>
                  </button>
                </div>
              </li>
            ) : (
              <li className="absolute bottom-4 w-[90%]">
                <div className="w-full flex items-center justify-center">
                  <button className="btn-secondary px-4 py-1 font-semibold rounded-md w-full bg-blue-800">
                    <Link onClick={onLogout}>Logout</Link>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      <main className="flex-grow w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default HomeLayout;
