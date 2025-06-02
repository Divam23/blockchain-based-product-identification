// src/pages/Unauthorized/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white text-center">
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="mb-6">You don't have permission to access this page.</p>
      <Link to="/" className="text-blue-500 underline">Go back to Home</Link>
    </div>
  );
};

export default Unauthorized;
