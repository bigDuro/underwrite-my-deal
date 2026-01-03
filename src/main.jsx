import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProvider from "./app/providers/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
