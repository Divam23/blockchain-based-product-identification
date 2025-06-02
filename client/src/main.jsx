import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { FirebaseProvider } from "./context/firebaseProvider";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ManufacturerProvider } from "./context/ManufacturerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FirebaseProvider>
      <ManufacturerProvider>
        <App />
        <ToastContainer />
      </ManufacturerProvider>
    </FirebaseProvider>
  </React.StrictMode>
);
