import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.webp"
// import { useFirebase } from "../../context/firebaseProvider";
import { useAuthFunctions } from "../../hooks/useAuthFunctions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInUser } = useAuthFunctions();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userData = await signInUser(email, password);
      const role = userData?.role;
      console.log("User role:", role);
  
      const fromPath = location.state?.from?.pathname;

      let redirectTo = "/";
      if (fromPath && fromPath !== "/login") {
        redirectTo = fromPath;
      } else if (role === "admin") {
        redirectTo = "/adminDashboard";
      } else {
        redirectTo = "/manufacturer-dash";
      }
      
      navigate(redirectTo, { replace: true });
        
  
      console.log("Redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
      
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <img
            alt="Secure Scan"
            src={Logo}
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-2xl font-semibold text-white">
            Welcome Back! <br /> Login to your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
