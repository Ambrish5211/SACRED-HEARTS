import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomeLayout from "./Layouts/HomeLayout";
import Login from "./Pages/User/Login";
import Register from "./Pages/User/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
}
export default App;
