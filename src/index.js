import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";

ReactDOM.render(
  <BrowserRouter>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
