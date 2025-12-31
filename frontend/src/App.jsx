import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";
import Home from "./Pages/Home";
import MoviesList from "./Pages/Movies/MoviesList";
import MovieDescription from "./Pages/Movies/MovieDescription";
import Notfound from "./Pages/NotFound";
import RequireAuth from "./Components/RequireAuth";

function App() {
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
      </Route>
      <Route path="*" element={<Notfound />}></Route>
    </Routes>
  );
}
export default App;
