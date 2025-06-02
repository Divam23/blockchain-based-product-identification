import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mt-4">Oops! Page not found.</p>
      <p className="text-lg text-gray-500 mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-page-3100375-2588415.png"
        alt="404 Illustration"
        className="w-80 mt-6"
      />
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PageNotFound;
