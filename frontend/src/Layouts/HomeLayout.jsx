import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutSuccess } from "../redux/slices/authSlice";
import Footer from "../Components/Footer/Footer";

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hideSearch = location.pathname.startsWith("/movies/description") || location.pathname === "/login" || location.pathname === "/register";

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const isAdmin = useSelector((state) => state?.auth?.isAdmin);

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

    const response = await dispatch(logoutSuccess());
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
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-zinc-800 text-white placeholder-gray-400 rounded-full pl-10 pr-10 py-2 w-48 focus:w-64 transition-all duration-300 outline-none border border-transparent focus:border-yellow-500 focus:bg-zinc-900"
                />

                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-zinc-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
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
