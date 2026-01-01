import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Creates the root React element and attaches it to the 'root' div in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // Development tool that activates additional checks and warnings to catch bugs
  <React.StrictMode>
    {/* Enables routing functionality throughout the entire app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
