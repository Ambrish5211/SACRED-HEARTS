import React from "react";
import { Toaster } from "react-hot-toast";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import HomeLayout from "./Layouts/HomeLayout.jsx";
import Home from "./Pages/Home.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      {/* <App /> */}
      <Home />
      <Toaster />
    </BrowserRouter>
  </Provider>,
);
