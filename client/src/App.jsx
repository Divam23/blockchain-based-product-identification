import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastNotification } from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin/Admin";
import DashboardOverview from "./pages/admin/DashboardOverview";
import Manufacturers from "./pages/admin/Manufacturers";
import AdminProducts from "./pages/Admin/AdminProducts";
import Reports from "./pages/admin/Reports";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Manufacturer from "./pages/Manafacturer/Manufacturer";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import ProductRegistration from "./pages/ProductRegistration/ProductRegistration";
import Signup from "./pages/Signup/Signup";
import Verification from "./pages/VerificationPage/Verification";
import Products from "./pages/Products/Products";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

function App() {
  return (
    <Router>
      <ToastNotification />
      <main className="mainContainer">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verification />} />

          {/* Manufacturer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/manufacturer-dash" element={<Manufacturer />} />
            <Route path="/reg-prod" element={<ProductRegistration />} />
            <Route path="/manufacturer-products" element={<Products />} />

          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/adminDashboard" element={<Admin />}>
              <Route index element={<DashboardOverview />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="manufacturers" element={<Manufacturers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Shared protected route (any logged-in role) */}
          <Route element={<ProtectedRoute allowedRoles={["manufacturer", "admin"]} />}>
            <Route path="/products" element={<Products />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* Catch all */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
