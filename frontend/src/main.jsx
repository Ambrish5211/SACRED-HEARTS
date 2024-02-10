import React from "react";
import { Toaster } from "react-hot-toast";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import HomeLayout from "./Layouts/HomeLayout.jsx";
import Home from "./Pages/Home.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-z8s7ch3x5qiwm83e.us.auth0.com"
        clientId="X3n37mrGfIiruw1e36nqpEbP6NFvowyp"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
      <Toaster />
    </BrowserRouter>
  </Provider>,
);
