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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "./redux/slices/authSlice";
import WatchList from "./Pages/User/WatchList"; // Import WatchList

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

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
