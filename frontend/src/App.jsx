import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import Home from "./Pages/Home";
import MoviesList from "./Pages/Movies/MoviesList";
import MovieDescription from "./Pages/Movies/MovieDescription";
import Notfound from "./Pages/NotFound";
import RequireAuth from "./Components/RequireAuth";
import AddMovie from "./Pages/Movies/AddMovie";
import AddGenre from "./Pages/Movies/AddGenre";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/slices/authSlice";
import WatchList from "./Pages/User/WatchList";
import axiosInstance from "./config/axiosInstance";
import toast from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const ticksRef = useRef(0);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Global background upload poller — runs regardless of which page the user is on
  useEffect(() => {
    const startPolling = () => {
      // Clear any existing interval before starting a new one
      if (intervalRef.current) clearInterval(intervalRef.current);

      ticksRef.current = 0; // reset counter on each new poll session
      intervalRef.current = setInterval(async () => {
        const pendingId = localStorage.getItem("pendingMovieUpload");
        if (!pendingId) {
          clearInterval(intervalRef.current);
          return;
        }

        // Timeout after 10 minutes (120 ticks × 5s)
        ticksRef.current += 1;
        if (ticksRef.current > 120) {
          localStorage.removeItem("pendingMovieUpload");
          clearInterval(intervalRef.current);
          toast.error("Movie upload timed out. Please check and try again.");
          return;
        }

        try {
          const res = await axiosInstance.get(`/movies/check-status/${pendingId}`);
          const { status } = res.data.data;

          if (status === "completed") {
            localStorage.removeItem("pendingMovieUpload");
            clearInterval(intervalRef.current);
            toast.success("🎉 Movie upload completed successfully!");
          } else if (status === "failed") {
            localStorage.removeItem("pendingMovieUpload");
            clearInterval(intervalRef.current);
            toast.error("Movie upload failed. Please try adding it again.");
          }
          // "processing" → do nothing, poll again in 5s
        } catch (err) {
          console.error("Background upload polling error:", err);
        }
      }, 5000);
    };

    // Start polling immediately if there's a pending upload (e.g. page refresh)
    if (localStorage.getItem("pendingMovieUpload")) {
      startPolling();
    }

    // Listen for new uploads triggered from AddMovie.jsx in same tab
    const onUploadQueued = () => startPolling();
    window.addEventListener("movieUploadQueued", onUploadQueued);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("movieUploadQueued", onUploadQueued);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/movies" element={<MoviesList />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route element={<RequireAuth />}>
        <Route
          path="/movies/description/:id"
          element={<MovieDescription />}
        ></Route>
        <Route path="/user/watchlist" element={<WatchList />} />
        <Route path="/admin/addmovie" element={<AddMovie />} />
        <Route path="/admin/editmovie/:id" element={<AddMovie />} />
        <Route path="/admin/addgenre" element={<AddGenre />} />
      </Route>
      <Route path="*" element={<Notfound />}></Route>
    </Routes>
  );
}
export default App;
