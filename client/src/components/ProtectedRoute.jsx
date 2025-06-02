import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useFirebase } from "../context/firebaseProvider";

const ProtectedRoute = ({ allowedRoles=[] }) => {
  const { user, loading } = useFirebase();
  const location = useLocation();

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;